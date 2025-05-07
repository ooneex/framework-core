import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  ControllerDecoratorException,
  type IResponse,
  Route,
  Router,
  RouterException,
  container,
} from '@';

describe('Router', () => {
  class TestController {
    public action({ response }: ContextType) {
      return response.json({ message: 'Hello, World!' });
    }
  }

  it('should support method chaining for addRoute', () => {
    const router = new Router();

    const result = router
      .addRoute({
        name: 'add_user',
        path: '/users',
        method: 'POST',
        controller: TestController,
      })
      .addRoute({
        name: 'get_user',
        path: '/users',
        method: 'GET',
        controller: TestController,
      });

    expect(result).toBe(router);
    expect(router.findRouteByName('add_user')).toBeDefined();
    expect(router.findRouteByName('get_user')).toBeDefined();
  });

  it('should ensure route is added', () => {
    const router = new Router();

    expect(router.findRouteByName('add_user')).toBe(null);

    router.addRoute({
      name: 'add_user',
      path: '/users',
      method: 'POST',
      controller: TestController,
    });

    expect(router.findRouteByName('add_user')).toBeDefined();
    expect(router.findRouteByName('add_user')?.name).toBe('add_user');
    expect(router.findRouteByName('add_user')?.path).toBe('/users');
    expect(router.findRouteByName('add_user')?.method).toBe('POST');
  });

  it('should add method for the same route', () => {
    const router = new Router();

    expect(router.findRouteByPath('/users')).toBe(null);

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

    expect(router.findRouteByPath('/users')?.length).toBe(2);
  });

  it('should throw error when adding duplicate route', () => {
    const router = new Router();

    const throwableFunction = () => {
      router.addRoute({
        name: 'add_user',
        path: '/users',
        method: 'POST',
        controller: TestController,
      });
      router.addRoute({
        name: 'add_user',
        path: '/users',
        method: 'GET',
        controller: TestController,
      });
    };

    expect(throwableFunction).toThrow(RouterException);
  });

  it('should retrieve all routes', () => {
    const router = new Router();

    expect(router.getRoutes().size).toBe(0);

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
    expect(router.getRoutes().size).toBe(1);

    router.addRoute({
      name: 'add_post',
      path: '/posts',
      method: 'POST',
      controller: TestController,
    });
    expect(router.getRoutes().size).toBe(2);
  });

  it('should return null for non-existing path', () => {
    const router = new Router();

    router.addRoute({
      name: 'add_user',
      path: '/users',
      method: 'POST',
      controller: TestController,
    });

    expect(router.findRouteByPath('/non-existing')).toBeNull();
  });

  it('should return null for non-existing route name', () => {
    const router = new Router();

    router.addRoute({
      name: 'add_user',
      path: '/users',
      method: 'POST',
      controller: TestController,
    });

    expect(router.findRouteByName('non-existing')).toBe(null);
  });

  it('should handle routes with all HTTP methods', () => {
    const router = new Router();
    const methods: Array<
      'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD'
    > = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

    for (const method of methods) {
      router.addRoute({
        name: `test_${method.toLowerCase()}`,
        path: '/api',
        method,
        controller: TestController,
      });
    }

    const routes = router.findRouteByPath('/api');

    expect(routes).not.toBeNull();
    expect(routes).toBeArrayOfSize(7);

    for (const method of methods) {
      const route = routes?.find((r) => r.method === method) ?? null;
      expect(route).not.toBeNull();
      expect(route?.name).toBe(`test_${method.toLowerCase()}`);
    }
  });

  it('should verify method chaining functionality for addRoute', () => {
    class PostController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Hello, World!' });
      }
    }

    const router = new Router();

    router.addRoute({
      name: 'add_user',
      path: '/users',
      method: 'POST',
      controller: PostController,
    });

    const route = router.findRouteByName('add_user');
    expect(route).toBeDefined();

    if (!route) {
      throw new Error('Route not found');
    }

    expect(container.get(route.controller)).toBeInstanceOf(PostController);
  });

  it('should throw error when trying to add a controller without Controller suffix', () => {
    const router = new Router();

    class InvalidService {
      public action({ response }: ContextType) {
        return response.json({ message: 'Hello, World!' });
      }
    }

    const throwableFunction = () => {
      router.addRoute({
        name: 'invalid_service',
        path: '/service',
        method: 'GET',
        controller: InvalidService,
      });
    };

    expect(throwableFunction).toThrow(ControllerDecoratorException);
    expect(throwableFunction).toThrow(
      'Controller decorator can only be used on controller classes. InvalidService must end with Controller keyword.',
    );
  });

  it('should properly handle complex paths with parameters', () => {
    const router = new Router();

    router.addRoute({
      name: 'get_user_post',
      path: '/users/:userId/posts/:postId',
      method: 'GET',
      controller: TestController,
    });

    const route = router.findRouteByName('get_user_post');
    expect(route).toBeDefined();
    expect(route?.path).toBe('/users/:userId/posts/:postId');
  });

  it('should work with empty routes map', () => {
    const router = new Router();

    expect(router.getRoutes().size).toBe(0);
    expect(router.findRouteByPath('/anything')).toBeNull();
    expect(router.findRouteByName('anything')).toBeNull();
  });

  it('should properly register singleton controller instances', () => {
    class UserTestController {
      public count = 0;

      public increment() {
        this.count++;
        return this.count;
      }
    }

    const router = new Router();

    // Register only once to avoid container binding conflicts
    router.addRoute({
      name: 'get_user',
      path: '/users',
      method: 'GET',
      controller: UserTestController,
    } as any);

    // Add second route with different controller
    class PostTestController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Post created' });
      }
    }

    router.addRoute({
      name: 'create_post',
      path: '/posts',
      method: 'POST',
      controller: PostTestController,
    });

    const route = router.findRouteByName('get_user');
    expect(route).toBeDefined();

    if (!route) {
      throw new Error('Route not found');
    }

    const controller = container.get<UserTestController>(route.controller);
    expect(controller).toBeInstanceOf(UserTestController);
    expect(controller.count).toBe(0);

    controller.increment();

    const sameController = container.get<UserTestController>(route.controller);
    expect(sameController).toBe(controller);
    expect(sameController.count).toBe(1);
  });

  describe('Route Decorator', () => {
    it('should throw error when decorator is used on invalid class', () => {
      const callback = () => {
        @Route.get('/test-path')
        // biome-ignore lint/correctness/noUnusedVariables: trust me
        class InvalidClass {
          public action({ response }: ContextType): IResponse {
            return response.json({ message: 'Hello, World!' });
          }
        }
      };

      expect(callback).toThrow(
        'Controller decorator can only be used on controller classes. InvalidClass must end with Controller keyword.',
      );
      expect(callback).toThrow(ControllerDecoratorException);
    });

    it('should handle valid controller with decorator', () => {
      @Route.get('/products')
      class ProductsController {
        public action({ response }: ContextType): IResponse {
          return response.json({ products: [] });
        }
      }

      expect(ProductsController.name).toBe('ProductsController');
    });
  });
});
