import { describe, expect, it } from 'bun:test';
import { HttpRequest, HttpResponse } from '@';
import { CookieMap, type RouterTypes } from 'bun';

describe('HttpResponse', () => {
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

  const request = new HttpRequest(
    new BRequest('http://localhost:3000/test?foo=bar'),
    { ip: '192.168.1.1' },
  );

  describe('json', () => {
    it('should set json response data and headers', () => {
      const response = new HttpResponse();
      const data = { foo: 'bar' };

      response.json(data);

      expect(response.getData()).toEqual(data);
      expect(response.header.get('Accept')).toBe('application/json');
      expect(response.header.get('Content-Type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    it('should allow custom status and charset', () => {
      const response = new HttpResponse();

      response.json({ foo: 'bar' }, 201, 'US-ASCII');

      expect(response.isSuccessful()).toBe(true);
      expect(response.header.get('Content-Type')).toBe(
        'application/json; charset=US-ASCII',
      );
    });
  });

  describe('exception', () => {
    it('should set error response', async () => {
      const response = new HttpResponse();
      const errorData = { code: 'ERROR_CODE' };
      response.exception('Error message', errorData, 400);
      const result = response.build(request);
      const body = await result.json();

      expect(body.message).toBe('Error message');
      expect(body.data).toEqual(errorData);
      expect(body.status).toBe(400);
      expect(body.success).toBe(false);
    });
  });

  describe('notFound', () => {
    it('should set not found response', () => {
      const response = new HttpResponse();

      response.notFound('Resource not found');

      expect(response.isClientError()).toBe(true);
      expect(response.isError()).toBe(true);
    });
  });

  describe('redirect', () => {
    it('should create redirect response', () => {
      const response = new HttpResponse();
      const redirectUrl = 'https://example.com';

      const result = response.redirect(redirectUrl);

      expect(result.status).toBe(307);
      expect(result.headers.get('Location')).toBe(redirectUrl);
    });
  });

  describe('build', () => {
    it('should build json response with request context', async () => {
      const response = new HttpResponse();
      response.json({ foo: 'bar' });
      const result = response.build(request);
      const body = await result.json();

      expect(body.data).toEqual({ foo: 'bar' });
      expect(body.message).toBe(null);
      expect(body.success).toBe(true);
      expect(body.status).toBe(200);
      expect(body.path).toBe('/test');
      expect(body.method).toBe('GET');
      expect(body.params).toEqual({});
      expect(body.payload).toEqual({});
      expect(body.queries).toEqual({ foo: 'bar' });
      expect(body.ip).toBe('192.168.1.1');
      expect(body.host).toBe(null);
      expect(body.language).toEqual({
        code: 'en',
        region: 'US',
      });
    });
  });

  describe('isSuccessful', () => {
    it('should return true for successful status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isSuccessful()).toBe(true);
    });

    it('should return false for non-successful status codes', () => {
      const response = new HttpResponse();
      response.json({}, 100);
      expect(response.isSuccessful()).toBe(false);
    });
  });

  describe('isInformational', () => {
    it('should return true for informational status codes', () => {
      const response = new HttpResponse();
      response.json({}, 100);
      expect(response.isInformational()).toBe(true);
    });

    it('should return false for non-informational status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isInformational()).toBe(false);
    });
  });

  describe('isRedirect', () => {
    it('should return true for redirect status codes', () => {
      const response = new HttpResponse();
      response.json({}, 301);
      expect(response.isRedirect()).toBe(true);
    });

    it('should return false for non-redirect status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isRedirect()).toBe(false);
    });
  });

  describe('isClientError', () => {
    it('should return true for client error status codes', () => {
      const response = new HttpResponse();
      response.json({}, 404);
      expect(response.isClientError()).toBe(true);
    });

    it('should return false for non-client error status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isClientError()).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for server error status codes', () => {
      const response = new HttpResponse();
      response.json({}, 500);
      expect(response.isServerError()).toBe(true);
    });

    it('should return false for non-server error status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isServerError()).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for server error status codes', () => {
      const response = new HttpResponse();
      response.json({}, 500);
      expect(response.isError()).toBe(true);
    });

    it('should return false for non-server error status codes', () => {
      const response = new HttpResponse();
      response.json({}, 200);
      expect(response.isError()).toBe(false);
    });
  });
});
