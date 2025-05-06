import { describe, expect, it } from 'bun:test';
import { HttpRequest } from '@';
import { CookieMap, type RouterTypes } from 'bun';

describe('HttpRequest', () => {
  class BRequest extends Request {
    params: RouterTypes.ExtractRouteParams<unknown>;
    readonly cookies: CookieMap;

    constructor(
      input: RequestInfo | URL,
      init?: RequestInit,
      config?: {
        params?: RouterTypes.ExtractRouteParams<unknown>;
        cookies?: Record<string, string>;
      },
    ) {
      super(input, init);

      if (config?.params) {
        this.params = config.params;
      }

      if (config?.cookies) {
        this.cookies = new CookieMap(config.cookies);
      }
    }
  }

  it('should parse URL and path correctly', () => {
    const request = new HttpRequest(
      new BRequest('http://localhost:3000/test?foo=bar'),
      { ip: '192.168.1.1' },
    );
    expect(request.url.native.toString()).toBe(
      'http://localhost:3000/test?foo=bar',
    );
    expect(request.path).toBe('/test');
  });

  it('should parse query parameters correctly', () => {
    const request = new HttpRequest(
      new BRequest('http://localhost:3000/test?foo=bar&baz=123'),
      { ip: '192.168.1.1' },
    );
    expect(request.queries.foo).toBe('bar');
    expect(request.queries.baz).toBe(123);
  });

  it('should parse headers correctly', () => {
    const headers = new Headers({
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-Forwarded-For': '127.0.0.1',
      Host: 'localhost:3000',
      Referer: 'http://example.com',
      Authorization: 'Bearer test-token',
    });
    const request = new HttpRequest(
      new BRequest('http://localhost:3000', { headers }),
      { ip: '192.168.1.1' },
    );

    expect(request.ip).toBe('192.168.1.1');
    expect(request.host).toBe('localhost:3000');
    expect(request.referer).toBe('http://example.com');
    expect(request.bearerToken).toBe('test-token');
  });

  it('should parse request parameters correctly', () => {
    const request = new HttpRequest(
      new BRequest('http://localhost:3000', undefined, {
        params: {
          id: '123',
          name: 'test',
        },
      }),
      { ip: '192.168.1.1' },
    );
    expect(request.params.id).toBe(123);
    expect(request.params.name).toBe('test');
  });

  it('should parse payload correctly', () => {
    const request = new HttpRequest(new BRequest('http://localhost:3000'), {
      payload: {
        data: { foo: 'bar' },
      },
      ip: '192.168.1.1',
    });
    expect(request.payload.data).toEqual({ foo: 'bar' });
  });

  it('should parse language preferences correctly', () => {
    const headers = new Headers({
      'Accept-Language': 'en-US,en;q=0.9',
    });
    const request = new HttpRequest(
      new BRequest('http://localhost:3000', { headers }),
      { ip: '192.168.1.1' },
    );
    expect(request.language?.code).toBe('en');
    expect(request.language?.region).toBe('US');
  });

  it('should handle custom language header', () => {
    const headers = new Headers({
      'X-Custom-Lang': 'fr',
    });
    const request = new HttpRequest(
      new BRequest('http://localhost:3000', { headers }),
      { ip: '192.168.1.1' },
    );
    expect(request.language?.code).toBe('fr');
    expect(request.language?.region).toBe(null);
  });

  it('should parse form data correctly', async () => {
    const formData = new FormData();
    formData.append('field1', 'value1');
    formData.append('field2', 'value2');

    const request = new HttpRequest(new BRequest('http://localhost:3000'), {
      form: formData,
      ip: '192.168.1.1',
    });

    const field1 = request.form?.get('field1');
    const field2 = request.form?.get('field2');

    expect(field1).toBeDefined();
    expect(field1).toBe('value1');
    expect(field2).toBeDefined();
    expect(field2).toBe('value2');
  });

  it('should handle file uploads in form data', async () => {
    const formData = new FormData();
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    formData.append('test', file);

    const request = new HttpRequest(new BRequest('http://localhost:3000'), {
      form: formData,
      ip: '192.168.1.1',
    });

    const uploadedFile = request.files.test;
    expect(uploadedFile?.originalName).toBe('test.txt');
    expect(uploadedFile?.name).toBeDefined();
    expect(uploadedFile?.type).toBe('text/plain');
  });

  it('should parse ip correctly', () => {
    const request = new HttpRequest(new BRequest('http://localhost:3000'), {
      ip: '127.0.0.1',
    });
    expect(request.ip).toBe('127.0.0.1');
  });

  it('should check cookies', () => {
    const request = new HttpRequest(
      new BRequest('http://localhost:3000', undefined, {
        cookies: { name: 'value', foo: 'bar' },
      }),
      { ip: '192.168.1.1' },
    );
    expect(request.cookies).toBeInstanceOf(CookieMap);
    expect(request.cookies.get('name')).toBe('value');
    expect(request.cookies.get('foo')).toBe('bar');
  });
});
