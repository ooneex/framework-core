import { describe, expect, it } from 'bun:test';
import {
  Assert,
  type ContextType,
  HttpResponse,
  type IResponse,
  type RouteConfigType,
  ValidationException,
  container,
  middleware,
} from '@';
import { handleRoute } from '../../src/router/handleRoute';

// Mock classes and helpers for testing
class MockHttpRequest {
  public path: string;
  public method: string;
  public params: Record<string, any>;
  public payload: Record<string, any>;
  public queries: Record<string, any>;
  public files: Record<string, any>;
  public cookies: any;
  public form: FormData | null;
  public ip: string;
  public host: string;
  public language: { code: string; region: string | null };
  public url: { path: string };

  constructor(config: {
    path?: string;
    method?: string;
    params?: Record<string, any>;
    payload?: Record<string, any>;
    queries?: Record<string, any>;
    ip?: string;
    host?: string;
  }) {
    this.path = config.path || '/test';
    this.method = config.method || 'GET';
    this.params = config.params || {};
    this.payload = config.payload || {};
    this.queries = config.queries || {};
    this.files = {};
    this.cookies = null;
    this.form = null;
    this.ip = config.ip || '127.0.0.1';
    this.host = config.host || 'localhost';
    this.language = { code: 'en', region: 'US' };
    this.url = { path: this.path };
  }

  build(context?: any): ContextType {
    return {
      request: this,
      route: context?.route || null,
      ip: this.ip,
      host: this.host,
      path: this.path,
      method: this.method,
      params: this.params,
      payload: this.payload,
      queries: this.queries,
      files: this.files,
      cookies: this.cookies,
      form: this.form,
      language: this.language,
      state: context?.state || {},
      response: context?.response || new HttpResponse(),
      user: context?.user || null,
    } as any;
  }
}

describe('router - additional coverage', () => {
  class TestController {
    public action({ response }: ContextType): IResponse {
      return response.json({ message: 'Hello, World!' });
    }
  }

  container.bind(TestController).toSelf().inSingletonScope();

  const route: RouteConfigType = {
    path: '/test',
    method: 'GET',
    controller: TestController,
  };

  // Test for lines 38-39: Controller route middleware intercepting the response
  it('should return response from controller middleware', async () => {
    @middleware()
    class RouteMiddleware {
      public next({ response }: ContextType): IResponse {
        return response.json({ message: 'route middleware response' });
      }
    }

    const routeWithMiddleware = {
      ...route,
      middlewares: {
        request: [RouteMiddleware],
      },
    };

    const request = new MockHttpRequest({});
    const context = request.build({
      route: routeWithMiddleware,
      response: new HttpResponse(),
    });

    const response = await handleRoute({ context });
    expect(response).toBeInstanceOf(Response);
    const responseData = await response.json();
    expect(responseData.data).toEqual({
      message: 'route middleware response',
    });
  });

  // Test for lines 44-48: Passing role validation
  it('should pass role validation when user has the required role', async () => {
    const routeWithRoles = {
      ...route,
      roles: ['admin', 'user'],
    };

    const request = new MockHttpRequest({});
    const context = request.build({
      route: routeWithRoles,
      response: new HttpResponse(),
      user: {
        getRoles: () => ['user'],
      },
    });

    const response = await handleRoute({ context });
    expect(response).toBeInstanceOf(Response);
    const responseData = await response.json();
    expect(responseData.data).toEqual({ message: 'Hello, World!' });
  });

  // Test for lines 61-62: Payload validator
  it('should validate payload successfully', async () => {
    class TestPayloadValidator {
      @Assert.IsString()
      name: string;
    }

    container.bind(TestPayloadValidator).toSelf().inSingletonScope();

    const routeWithValidators = {
      ...route,
      validators: {
        payload: [TestPayloadValidator],
      },
    };

    const request = new MockHttpRequest({
      payload: { name: 'test-name' },
    });

    const context = request.build({
      route: routeWithValidators,
      response: new HttpResponse(),
    });

    const response = await handleRoute({ context });
    expect(response).toBeInstanceOf(Response);
    const responseData = await response.json();
    expect(responseData.data).toEqual({ message: 'Hello, World!' });
  });

  // Test for lines 86-88, 90-97: Response validation and middleware chain
  it('should validate response and apply response middleware chain', async () => {
    class ResponseModel {
      @Assert.IsString()
      message: string;
    }

    container.bind(ResponseModel).toSelf().inSingletonScope();

    @middleware()
    class ControllerResponseMiddleware {
      public next(context: ContextType): ContextType | IResponse {
        const data = context.response.getData() as Record<string, unknown>;
        return {
          ...context,
          response: new HttpResponse().json({
            ...data,
            controllerMiddleware: true,
          }),
        };
      }
    }

    @middleware()
    class GlobalResponseMiddleware {
      public next(context: ContextType): ContextType | IResponse {
        const data = context.response.getData() as Record<string, unknown>;
        return {
          ...context,
          response: new HttpResponse().json({
            ...data,
            globalMiddleware: true,
          }),
        };
      }
    }

    const routeWithValidatorsAndMiddlewares = {
      ...route,
      validators: {
        response: [ResponseModel],
      },
      middlewares: {
        response: [ControllerResponseMiddleware],
      },
    };

    const request = new MockHttpRequest({});
    const context = request.build({
      route: routeWithValidatorsAndMiddlewares,
      response: new HttpResponse(),
    });

    const response = await handleRoute({
      context,
      middlewares: {
        response: [GlobalResponseMiddleware],
      },
    });

    expect(response).toBeInstanceOf(Response);
    const responseData = await response.json();
    expect(responseData.data.message).toBe('Hello, World!');
    expect(responseData.data.controllerMiddleware).toBe(true);
    expect(responseData.data.globalMiddleware).toBe(true);
  });

  // Test for lines 86-88: Response validation failure
  it('should throw when response validation fails', async () => {
    class ResponseModel {
      @Assert.IsNumber()
      count: number;
    }

    container.bind(ResponseModel).toSelf().inSingletonScope();

    class InvalidResponseController {
      public action({ response }: ContextType): IResponse {
        return response.json({ count: 'not-a-number' });
      }
    }

    container.bind(InvalidResponseController).toSelf().inSingletonScope();

    const routeWithInvalidResponse = {
      ...route,
      controller: InvalidResponseController,
      validators: {
        response: [ResponseModel],
      },
    };

    const request = new MockHttpRequest({});
    const context = request.build({
      route: routeWithInvalidResponse,
      response: new HttpResponse(),
    });

    try {
      await handleRoute({ context });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationException);
      expect((error as any).message).toContain('count must be a number');
    }
  });
});
