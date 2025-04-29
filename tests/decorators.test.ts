import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  HttpRequest,
  HttpResponse,
  type IResponse,
  Route,
  config,
  container,
  inject,
  router,
  service,
} from '@';
import { CookieMap, type RouterTypes } from 'bun';

describe('Controller decorator', () => {
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

  function createTestContext(): ContextType {
    const request = new HttpRequest(
      new BRequest('http://localhost:3000/test'),
      { ip: '127.0.0.1' },
    );
    const response = new HttpResponse();

    return {
      state: {},
      request,
      response,
      exception: null,
      params: request.params,
      payload: request.payload,
      queries: request.queries,
      cookies: request.cookies,
      form: request.form,
      language: request.language,
      path: request.path,
      method: request.method,
      header: request.header,
      ip: request.ip,
      host: request.host,
      bearerToken: request.bearerToken,
      envVars: {},
    };
  }

  it('get', () => {
    @Route.get('/posts', { name: 'get_all_posts' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Hello, World!' });
      }
    }

    const route = router.findRouteByName('get_all_posts');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('GET');
    expect(route?.path).toEqual('/posts');
    expect(route?.name).toEqual('get_all_posts');
  });

  it('post', () => {
    @Route.post('/posts', { name: 'create_post' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Post created' });
      }
    }

    const route = router.findRouteByName('create_post');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('POST');
    expect(route?.path).toEqual('/posts');
    expect(route?.name).toEqual('create_post');
  });

  it('put', () => {
    @Route.put('/posts/:id', { name: 'update_post' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Post updated' });
      }
    }

    const route = router.findRouteByName('update_post');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('PUT');
    expect(route?.path).toEqual('/posts/:id');
    expect(route?.name).toEqual('update_post');
  });

  it('delete', () => {
    @Route.delete('/posts/:id', { name: 'delete_post' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Post deleted' });
      }
    }

    const route = router.findRouteByName('delete_post');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('DELETE');
    expect(route?.path).toEqual('/posts/:id');
    expect(route?.name).toEqual('delete_post');
  });

  it('patch', () => {
    @Route.patch('/posts/:id', { name: 'patch_post' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Post patched' });
      }
    }

    const route = router.findRouteByName('patch_post');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('PATCH');
    expect(route?.path).toEqual('/posts/:id');
    expect(route?.name).toEqual('patch_post');
  });

  it('options', () => {
    @Route.options('/posts', { name: 'options_posts' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Options for posts' });
      }
    }

    const route = router.findRouteByName('options_posts');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('OPTIONS');
    expect(route?.path).toEqual('/posts');
    expect(route?.name).toEqual('options_posts');
  });

  it('head', () => {
    @Route.head('/posts', { name: 'head_posts' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Head for posts' });
      }
    }

    const route = router.findRouteByName('head_posts');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('HEAD');
    expect(route?.path).toEqual('/posts');
    expect(route?.name).toEqual('head_posts');
  });

  it('should generate a random UUID when name is not provided', () => {
    @Route.get('/random-path')
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Random UUID test' });
      }
    }

    const routes = router.findRouteByPath('/random-path');
    expect(routes).not.toBeNull();

    if (routes) {
      const route = routes.find((r) => r.method === 'GET');
      expect(route).not.toBeUndefined();
      expect(route?.controller).toEqual(Controller);
      expect(route?.method).toEqual('GET');
      expect(route?.path).toEqual('/random-path');
      expect(route?.name).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    }
  });

  it('should support additional configuration options', () => {
    const validators = ['validator1', 'validator2'];
    const middlewares = ['middleware1', 'middleware2'];

    @Route.post('/config-test', {
      name: 'config_test',
      validators,
      middlewares,
    })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Config test' });
      }
    }

    const route = router.findRouteByName('config_test');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('POST');
    expect(route?.path).toEqual('/config-test');
    expect(route?.name).toEqual('config_test');
    expect(route?.validators).toEqual(validators);
    expect(route?.middlewares).toEqual(middlewares);
  });

  it('should handle different path patterns', () => {
    @Route.get('/users/:id/posts/:postId', { name: 'get_user_post' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'User post' });
      }
    }

    const route = router.findRouteByName('get_user_post');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('GET');
    expect(route?.path).toEqual('/users/:id/posts/:postId');
    expect(route?.name).toEqual('get_user_post');
  });

  it('should handle root path', () => {
    @Route.get('/', { name: 'home' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'Home page' });
      }
    }

    const route = router.findRouteByName('home');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('GET');
    expect(route?.path).toEqual('/');
    expect(route?.name).toEqual('home');
  });

  it('should handle nested routes', () => {
    @Route.get('/api/v1/users', { name: 'api_users' })
    class Controller {
      public action({ response }: ContextType): IResponse {
        return response.json({ message: 'API Users' });
      }
    }

    const route = router.findRouteByName('api_users');

    expect(route?.controller).toEqual(Controller);
    expect(route?.method).toEqual('GET');
    expect(route?.path).toEqual('/api/v1/users');
    expect(route?.name).toEqual('api_users');
  });

  describe('Controller action', () => {
    it('should return correct JSON response for GET route', async () => {
      @Route.get('/test-action', { name: 'test_get_action' })
      class TestController {
        public action({ response }: ContextType): IResponse {
          return response.json({ message: 'GET action response' });
        }
      }

      const route = router.findRouteByName('test_get_action');
      expect(route).not.toBeNull();

      if (!route) {
        throw new Error('Route not found');
      }

      const controller = new (route.controller as typeof TestController)();
      expect(controller).toBeInstanceOf(TestController);

      const context = createTestContext();
      const result = controller.action(context) as IResponse;

      expect(result).toBe(context.response);
      expect(result.getData()).toEqual({ message: 'GET action response' });

      const builtResponse = result.build(context.request);
      const responseBody = await builtResponse.json();

      expect(responseBody.data).toEqual({ message: 'GET action response' });
      expect(responseBody.success).toBe(true);
      expect(responseBody.status).toBe(200);
    });

    it('should return correct JSON response for POST route', async () => {
      // Define controller class
      @Route.post('/test-post', { name: 'test_post_action' })
      class TestController {
        public action({ response }: ContextType): IResponse {
          return response.json({ message: 'POST action response' }, 201);
        }
      }

      const route = router.findRouteByName('test_post_action');
      expect(route).not.toBeNull();

      if (!route) {
        throw new Error('Route not found');
      }

      const controller = new (route.controller as typeof TestController)();
      expect(controller).toBeInstanceOf(TestController);

      const context = createTestContext();
      const result = controller.action(context);

      expect(result).toBe(context.response);
      expect(result.getData()).toEqual({ message: 'POST action response' });

      const builtResponse = result.build(context.request);
      const responseBody = await builtResponse.json();

      expect(responseBody.data).toEqual({ message: 'POST action response' });
      expect(responseBody.success).toBe(true);
      expect(responseBody.status).toBe(201);
    });

    it('should handle error responses', async () => {
      @Route.get('/test-error', { name: 'test_error_action' })
      class TestController {
        public action({ response }: ContextType): IResponse {
          return response.exception(
            'Error occurred',
            { code: 'TEST_ERROR' },
            400,
          );
        }
      }

      const route = router.findRouteByName('test_error_action');
      expect(route).not.toBeNull();

      if (!route) {
        throw new Error('Route not found');
      }

      const controller = new (route.controller as typeof TestController)();
      expect(controller).toBeInstanceOf(TestController);

      const context = createTestContext();
      const result = controller.action(context);

      expect(result).toBe(context.response);

      const builtResponse = result.build(context.request);
      const responseBody = await builtResponse.json();

      expect(responseBody.message).toBe('Error occurred');
      expect(responseBody.data).toEqual({ code: 'TEST_ERROR' });
      expect(responseBody.success).toBe(false);
      expect(responseBody.status).toBe(400);
    });
  });

  it('Controller dependencies injection', () => {
    @config()
    class PostConfig {
      public get<T>(): T {
        return 'test' as T;
      }
    }

    @service()
    class PostService {
      constructor(
        @inject(PostConfig)
        public readonly config: PostConfig,
      ) {}

      public execute<T>(): T {
        return 'post created' as T;
      }

      public getEnv(): string {
        return this.config.get();
      }
    }

    @Route.get('/posts')
    class PostController {
      constructor(
        @inject(PostService)
        public readonly postService: PostService,
      ) {}

      public async action({ response }: ContextType): Promise<IResponse> {
        return response.json({
          message: this.postService.execute(),
          env: this.postService.getEnv(),
        });
      }
    }

    const controller = container.get(PostController);
    expect(controller).toBeInstanceOf(PostController);
    expect(controller.postService).toBeInstanceOf(PostService);
    expect(controller.postService.config).toBeInstanceOf(PostConfig);
  });
});
