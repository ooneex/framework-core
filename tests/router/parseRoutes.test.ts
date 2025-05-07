import { describe, expect, it } from 'bun:test';
import { type ContextType, Router } from '@';
import { parseRoutes } from '../../src/router/parseRoutes';

describe('router', () => {
  class TestController {
    public action({ response }: ContextType) {
      return response.json({ message: 'Hello, World!' });
    }
  }

  class ErrorController {
    public action({ response }: ContextType) {
      return response.json({ error: 'An error occurred' }, 500);
    }
  }

  class TestMiddleware {
    public async next(context: ContextType) {
      return context;
    }
  }

  it('parseRoutes with basic routes', async () => {
    const router = new Router();

    router.addRoute({
      name: 'add_user',
      path: '/users',
      method: 'POST',
      controller: TestController,
    });
    router.addRoute({
      name: 'retrieve_user',
      path: '/users',
      method: 'GET',
      controller: TestController,
    });
    router.addRoute({
      name: 'delete_user',
      path: '/users',
      method: 'DELETE',
      controller: TestController,
    });
    router.addRoute({
      name: 'add_post',
      path: '/posts',
      method: 'POST',
      controller: TestController,
    });

    const parsedRoutes = await parseRoutes(router);
    expect(parsedRoutes['/users'].POST).toBeFunction();
    expect(parsedRoutes['/users'].GET).toBeFunction();
    expect(parsedRoutes['/users'].DELETE).toBeFunction();
    expect(parsedRoutes['/posts'].POST).toBeFunction();
  });

  it('parseRoutes with all HTTP methods', async () => {
    const router = new Router();
    const methods: string[] = [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS',
      'HEAD',
    ];

    for (const method of methods) {
      router.addRoute({
        name: `test_${method.toLowerCase()}`,
        path: '/test',
        method: method as any,
        controller: TestController,
      });
    }

    const parsedRoutes = await parseRoutes(router);

    for (const method of methods) {
      // @ts-ignore: trust me
      expect(parsedRoutes['/test'][method]).toBeFunction();
    }
  });

  it('parseRoutes with route parameters', async () => {
    const router = new Router();

    router.addRoute({
      name: 'get_user_by_id',
      path: '/users/:id',
      method: 'GET',
      controller: TestController,
    });

    router.addRoute({
      name: 'get_user_posts',
      path: '/users/:userId/posts/:postId',
      method: 'GET',
      controller: TestController,
    });

    const parsedRoutes = await parseRoutes(router);
    expect(parsedRoutes['/users/:id'].GET).toBeFunction();
    expect(parsedRoutes['/users/:userId/posts/:postId'].GET).toBeFunction();
  });

  it('parseRoutes with middlewares', async () => {
    const router = new Router();
    const middleware = TestMiddleware;

    router.addRoute({
      name: 'with_middleware',
      path: '/middleware-test',
      method: 'GET',
      controller: TestController,
      middlewares: {
        request: [middleware],
        response: [middleware],
      },
    });

    const parsedRoutes = await parseRoutes(router, {
      middlewares: {
        request: [middleware],
        response: [middleware],
      },
    });

    expect(parsedRoutes['/middleware-test'].GET).toBeFunction();
  });

  it('parseRoutes with error controller', async () => {
    const router = new Router();

    router.addRoute({
      name: 'potential_error',
      path: '/error-test',
      method: 'GET',
      controller: TestController,
    });

    const parsedRoutes = await parseRoutes(router, {
      errorController: ErrorController,
    });

    expect(parsedRoutes['/error-test'].GET).toBeFunction();
  });

  it('parseRoutes with empty router', async () => {
    const router = new Router();
    const parsedRoutes = await parseRoutes(router);

    expect(Object.keys(parsedRoutes).length).toBe(0);
  });
});
