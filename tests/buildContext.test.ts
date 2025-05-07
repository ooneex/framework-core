import { describe, expect, it, mock, spyOn } from 'bun:test';
import { HttpRequest, HttpResponse } from '@';
import { buildContext } from '../src/buildContext';

describe('buildContext', () => {
  // Mock default BunRequest
  const createMockRequest = (overrides = {}) => {
    const defaultRequest = {
      url: 'http://example.com/test?param=value',
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Cookie: 'session=123; theme=dark',
        'Accept-Language': 'en-US,en;q=0.9',
        Host: 'example.com',
      }),
      json: mock(() => Promise.resolve({})),
      formData: mock(() => Promise.reject(new Error('No form data'))),
      query: { param: 'value' },
      params: { id: '123' },
    };

    return { ...defaultRequest, ...overrides };
  };

  // Mock Server
  const createMockServer = (ipAddress = '127.0.0.1') => ({
    requestIP: mock(() => ({ address: ipAddress })),
  });

  it('should build a context with default values', async () => {
    const mockReq = createMockRequest() as any;

    const context = await buildContext({
      request: mockReq,
    });

    expect(context).toBeDefined();
    expect(context.request).toBeInstanceOf(HttpRequest);
    expect(context.response).toBeInstanceOf(HttpResponse);
    expect(context.ip).toBe('unknown');
    expect(context.method).toBe('GET');
    expect(context.path).toBeDefined();
    expect(context.state).toEqual({});
    expect(context.payload).toEqual({});
    expect(context.cookies).toBeDefined();
  });

  it('should use server IP if available', async () => {
    const mockReq = createMockRequest() as any;
    const mockServer = createMockServer('192.168.0.1') as any;

    const context = await buildContext({
      request: mockReq,
      server: mockServer,
    });

    expect(context.ip).toBe('192.168.0.1');
    expect(mockServer.requestIP).toHaveBeenCalledWith(mockReq);
  });

  it('should use provided IP if server is not available', async () => {
    const mockReq = createMockRequest() as any;

    const context = await buildContext({
      request: mockReq,
      ip: '10.0.0.1',
    });

    expect(context.ip).toBe('10.0.0.1');
  });

  it('should parse JSON payload when available', async () => {
    const testPayload = { name: 'test', value: 123 };
    const mockReq = createMockRequest({
      json: mock(() => Promise.resolve(testPayload)),
    }) as any;

    const context = await buildContext({
      request: mockReq,
    });

    expect(context.payload).toEqual(testPayload);
    expect(mockReq.json).toHaveBeenCalled();
  });

  it('should handle JSON parsing errors gracefully', async () => {
    const mockReq = createMockRequest({
      json: mock(() => Promise.reject(new Error('Invalid JSON'))),
    }) as any;

    const context = await buildContext({
      request: mockReq,
    });

    expect(context.payload).toEqual({});
    expect(mockReq.json).toHaveBeenCalled();
  });

  it('should parse form data when available', async () => {
    const mockFormData = new FormData();
    mockFormData.append('field1', 'value1');
    mockFormData.append('field2', 'value2');

    const mockReq = createMockRequest({
      formData: mock(() => Promise.resolve(mockFormData)),
    }) as any;

    const context = await buildContext({
      request: mockReq,
    });

    expect(context.form).toEqual(mockFormData);
    expect(mockReq.formData).toHaveBeenCalled();
  });

  it('should handle form data parsing errors gracefully', async () => {
    const mockReq = createMockRequest({
      formData: mock(() => Promise.reject(new Error('No form data'))),
    }) as any;

    const context = await buildContext({
      request: mockReq,
    });

    expect(context.form).toBeNull();
    expect(mockReq.formData).toHaveBeenCalled();
  });

  it('should include route configuration when provided', async () => {
    const mockReq = createMockRequest() as any;
    const mockRoute = {
      path: '/test/:id',
      method: 'GET',
      handler: () => {},
    } as any;

    const context = await buildContext({
      request: mockReq,
      route: mockRoute,
    });

    expect(context.route).toBe(mockRoute);
  });

  it('should correctly pass all request properties to the context', async () => {
    const mockReq = createMockRequest() as any;

    // @ts-ignore: trust me
    spyOn(HttpRequest.prototype, 'constructor');

    const context = await buildContext({
      request: mockReq,
      ip: '127.0.0.1',
    });

    // Verify all properties from request are passed to context
    expect(context.params).toBe(context.request.params);
    expect(context.queries).toBe(context.request.queries);
    expect(context.files).toBe(context.request.files);
    expect(context.cookies).toBe(context.request.cookies);
    expect(context.form).toBe(context.request.form);
    expect(context.language).toBe(context.request.language);
    expect(context.path).toBe(context.request.path);
    expect(context.method).toBe(context.request.method);
    expect(context.header).toBe(context.request.header);
    expect(context.host).toBe(context.request.host);
  });

  it('should create HttpResponse with request cookies', async () => {
    const mockReq = createMockRequest() as any;

    // @ts-ignore: trust me
    spyOn(HttpResponse.prototype, 'constructor');

    const context = await buildContext({
      request: mockReq,
    });

    expect(context.response).toBeInstanceOf(HttpResponse);
    // The response should be initialized with the request cookies
    expect(context.response.cookies).toBe(context.request.cookies);
  });
});
