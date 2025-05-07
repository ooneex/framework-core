import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  Exception,
  HttpRequest,
  HttpResponse,
  type IResponse,
  type RouteConfigType,
  container,
  middleware,
} from '@';
import { CookieMap, type RouterTypes } from 'bun';
import {
  buildErrorResponse,
  buildExecptionDataFromContext,
  handleRoute,
} from '../../src/router/handleRoute';

describe('router', () => {
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
        this.cookies = new CookieMap(config?.cookies || {});
      }
    }
  }

  class TestHandleRouteController {
    public action({ response }: ContextType): IResponse {
      return response.json({ message: 'Hello, World!' });
    }
  }

  container.bind(TestHandleRouteController).toSelf().inSingletonScope();

  const route: RouteConfigType = {
    path: '/test',
    method: 'GET',
    controller: TestHandleRouteController,
  };

  describe('handleRoute', () => {
    describe('global middleware', () => {
      it('should return response object', async () => {
        @middleware()
        class TestHandleRouteMiddleware {
          public next({ response }: ContextType): IResponse {
            return response.json({ message: 'global request middleware' });
          }
        }

        const response = await handleRoute({
          // @ts-ignore
          context: {
            request: new HttpRequest(
              new BRequest('http://localhost:3000/test?foo=bar&baz=123'),
              { ip: '' },
            ),
            route,
            ip: '127.0.0.1',
            host: 'localhost',
            path: '/test',
            method: 'GET',
            params: {},
            payload: {},
            queries: {},
            files: {},
            cookies: null,
            form: null,
            language: { code: 'en', region: 'US' },
            state: {},
            response: new HttpResponse(),
          },
          middlewares: { request: [TestHandleRouteMiddleware] },
        });

        expect(response).toBeInstanceOf(Response);
        expect((await response.json()).data).toEqual({
          message: 'global request middleware',
        });
      });
    });
  });

  describe('buildErrorResponse', () => {
    it('should handle an exception and return a response', async () => {
      // @ts-ignore: trust me
      const context: ContextType = {
        request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
          ip: '',
        }),
        route,
        ip: '127.0.0.1',
        host: 'localhost',
        path: '/test',
        method: 'GET',
        params: {},
        payload: {},
        queries: {},
        files: {},
        cookies: null,
        form: null,
        language: { code: 'en', region: 'US' },
        state: {},
        response: new HttpResponse(),
      };

      const error = new Error('Test error');
      const response = await buildErrorResponse({
        error,
        context,
      });

      expect(response).toBeInstanceOf(Response);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Test error');
    });

    it('should use an existing Exception if provided', async () => {
      // @ts-ignore: trust me
      const context: ContextType = {
        request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
          ip: '',
        }),
        route,
        ip: '127.0.0.1',
        host: 'localhost',
        path: '/test',
        method: 'GET',
        params: {},
        payload: {},
        queries: {},
        files: {},
        cookies: null,
        form: null,
        language: { code: 'en', region: 'US' },
        state: {},
        response: new HttpResponse(),
      };

      const customError = new Exception('Custom exception', 400, {
        customData: 'test',
      });
      const response = await buildErrorResponse({
        error: customError,
        context,
      });

      expect(response).toBeInstanceOf(Response);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Custom exception');
      expect(responseData.data).toEqual({ customData: 'test' });
      expect(responseData.status).toBe(400);
    });

    it('should use error controller if provided', async () => {
      class TestErrorController {
        public action({ response }: ContextType): IResponse {
          return response.json({ customErrorHandler: true });
        }
      }

      container.bind(TestErrorController).toSelf().inSingletonScope();

      // @ts-ignore: trust me
      const context: ContextType = {
        request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
          ip: '',
        }),
        route,
        ip: '127.0.0.1',
        host: 'localhost',
        path: '/test',
        method: 'GET',
        params: {},
        payload: {},
        queries: {},
        files: {},
        cookies: null,
        form: null,
        language: { code: 'en', region: 'US' },
        state: {},
        response: new HttpResponse(),
      };

      const error = new Error('Test error');
      const response = await buildErrorResponse({
        error,
        errorController: TestErrorController,
        context,
      });

      expect(response).toBeInstanceOf(Response);
      const responseData = await response.json();
      expect(responseData.data).toEqual({ customErrorHandler: true });
    });
  });

  describe('buildExecptionDataFromContext', () => {
    it('should extract relevant data from context', () => {
      //  @ts-ignore: trust me
      const context: ContextType = {
        state: { foo: 'bar' },
        params: { id: '123' },
        payload: { name: 'test' },
        queries: { filter: 'active' },
        language: { code: 'en', region: 'US' },
        path: '/test/123',
        method: 'POST',
        ip: '127.0.0.1',
        host: 'localhost',
      };

      const result = buildExecptionDataFromContext(context);

      expect(result).toEqual({
        state: { foo: 'bar' },
        params: { id: '123' },
        payload: { name: 'test' },
        queries: { filter: 'active' },
        language: { code: 'en', region: 'US' },
        path: '/test/123',
        method: 'POST',
        ip: '127.0.0.1',
        host: 'localhost',
      });
    });
  });
});
