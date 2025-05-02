import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  MiddlewareDecoratorException,
  container,
  inject,
  middleware,
} from '@';

describe('Middleware Decorator', () => {
  it('should register a valid middleware class in the container', () => {
    @middleware()
    class TestMiddleware {
      public next(context: ContextType): Promise<ContextType> | ContextType {
        return context;
      }
    }

    const instance = container.get<TestMiddleware>(TestMiddleware);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestMiddleware);
    expect(instance.next).toBeFunction();
  });

  it('should register middleware class with transient scope', () => {
    @middleware('transient')
    class TransientScopedMiddleware {
      public next(context: ContextType): Promise<ContextType> | ContextType {
        return context;
      }
    }

    const instance1 = container.get<TransientScopedMiddleware>(
      TransientScopedMiddleware,
    );
    const instance2 = container.get<TransientScopedMiddleware>(
      TransientScopedMiddleware,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register middleware class with request scope', () => {
    @middleware('request')
    class RequestScopedMiddleware {
      public next(context: ContextType): Promise<ContextType> | ContextType {
        return context;
      }
    }

    const instance1 = container.get<RequestScopedMiddleware>(
      RequestScopedMiddleware,
    );
    const instance2 = container.get<RequestScopedMiddleware>(
      RequestScopedMiddleware,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register middleware class with singleton scope by default', () => {
    @middleware()
    class SingletonScopedMiddleware {
      public next(context: ContextType): Promise<ContextType> | ContextType {
        return context;
      }
    }

    const instance1 = container.get<SingletonScopedMiddleware>(
      SingletonScopedMiddleware,
    );
    const instance2 = container.get<SingletonScopedMiddleware>(
      SingletonScopedMiddleware,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @middleware()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public next(context: ContextType): Promise<ContextType> | ContextType {
          return context;
        }
      }
    };

    expect(callback).toThrow(
      'Middleware decorator can only be used on middleware classes. InvalidClass must end with Middleware keyword.',
    );
    expect(callback).toThrow(MiddlewareDecoratorException);
  });

  it('should properly inject dependencies in middleware classes', () => {
    @middleware()
    class DependencyMiddleware {
      public next(context: ContextType): Promise<ContextType> | ContextType {
        return context;
      }
    }

    @middleware()
    class InjectedMiddleware {
      constructor(
        @inject(DependencyMiddleware)
        public dependency: DependencyMiddleware,
      ) {}

      public next(context: ContextType): Promise<ContextType> | ContextType {
        return context;
      }
    }

    const instance = container.get<InjectedMiddleware>(InjectedMiddleware);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedMiddleware);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyMiddleware);
  });
});
