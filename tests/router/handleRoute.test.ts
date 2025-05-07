import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  HttpRequest,
  HttpResponse,
  type IResponse,
  type RouteConfigType,
  container,
  middleware,
} from '@';
import { CookieMap, type RouterTypes } from 'bun';
import { handleRoute } from '../../src/router/handleRoute';

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
});
