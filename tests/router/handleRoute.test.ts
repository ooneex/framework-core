import { describe, expect, it } from 'bun:test';
import {
  Assert,
  type ContextType,
  Exception,
  HttpRequest,
  HttpResponse,
  type IResponse,
  NotFoundException,
  type RouteConfigType,
  UnauthorizedException,
  ValidationException,
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
        } as any);

        expect(response).toBeInstanceOf(Response);
        expect((await response.json()).data).toEqual({
          message: 'global request middleware',
        });
      });
    });

    describe('route validation', () => {
      it('should throw UnauthorizedException when user lacks required role', async () => {
        const routeWithRoles = {
          ...route,
          roles: ['admin'],
        };

        const context = {
          request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
            ip: '',
          }),
          route: routeWithRoles,
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
          user: {
            getRoles: () => ['user'],
          },
        };

        try {
          await handleRoute({ context } as any);
        } catch (error: any) {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe('Access denied');
        }
      });

      it('should throw NotFoundException when route is not found', async () => {
        const context = {
          request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
            ip: '',
          }),
          route: null,
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

        try {
          await handleRoute({ context } as any);
          expect(true).toBe(false);
        } catch (error: any) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('Route not found');
        }
      });
    });

    describe('validators', () => {
      it('should validate params', async () => {
        // Simple mock validator class that works with class-validator
        class TestParamValidator {
          @Assert.IsString()
          test: string;
        }

        // Register the validator with the container
        container.bind(TestParamValidator).toSelf().inSingletonScope();

        // We'll create a simple route test with mock context
        const testRoute = {
          ...route,
          validators: {
            params: [TestParamValidator],
          },
        };

        const context = {
          request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
            ip: '',
          }),
          route: testRoute,
          ip: '127.0.0.1',
          host: 'localhost',
          path: '/test',
          method: 'GET',
          params: { test: 123 }, // Numeric value will fail IsString validation
          payload: {},
          queries: {},
          files: {},
          cookies: null,
          form: null,
          language: { code: 'en', region: 'US' },
          state: {},
          response: new HttpResponse(),
        };

        try {
          await handleRoute({ context } as any);

          // If we got here, something went wrong
          expect(true).toBe(false);
        } catch (error: any) {
          expect(error).toBeInstanceOf(ValidationException);
          expect(error.message).toContain('test must be a string');
        }
      });
    });

    describe('response middleware', () => {
      it('should process response middleware chain', async () => {
        @middleware()
        class ResponseMiddleware {
          public next({ response }: ContextType): IResponse {
            const data = response.getData();
            return response.json({
              ...data,
              modified: true,
            });
          }
        }

        const routeWithMiddleware = {
          ...route,
          middlewares: {
            response: [ResponseMiddleware],
          },
        };

        const context = {
          request: new HttpRequest(new BRequest('http://localhost:3000/test'), {
            ip: '',
          }),
          route: routeWithMiddleware,
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

        const response = await handleRoute({ context } as any);
        const responseData = await response.json();
        expect(responseData.data.modified).toBe(true);
      });
    });
  });

  describe('buildErrorResponse', () => {
    it('should handle an exception and return a response', async () => {
      const context = {
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
      } as any);

      expect(response).toBeInstanceOf(Response);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Test error');
    });

    it('should use an existing Exception if provided', async () => {
      const context = {
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
      } as any);

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

      const context = {
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
      } as any);

      expect(response).toBeInstanceOf(Response);
      const responseData = await response.json();
      expect(responseData.data).toEqual({ customErrorHandler: true });
    });
  });

  describe('buildExecptionDataFromContext', () => {
    it('should extract relevant data from context', () => {
      const context = {
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

      const result = buildExecptionDataFromContext(context as any);

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
