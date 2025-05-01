import { describe, expect, it } from 'bun:test';
import { ConfigDecoratorException, config, container, inject } from '@';

describe('Config Decorator', () => {
  it('should register a valid config class in the container', () => {
    @config()
    class TestConfig {
      public get<T>(): T {
        return { value: 'test' } as T;
      }
    }

    const instance = container.get<TestConfig>(TestConfig);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestConfig);
    expect(instance.get<{ value: string }>().value).toBe('test');
  });

  it('should register config class with transient scope', () => {
    @config('transient')
    class TransientScopedConfig {
      public get<T>(): T {
        return { value: 'test' } as T;
      }
    }

    const instance1 = container.get<TransientScopedConfig>(
      TransientScopedConfig,
    );
    const instance2 = container.get<TransientScopedConfig>(
      TransientScopedConfig,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register config class with singleton scope by default', () => {
    @config()
    class SingletonScopedConfig {
      public get<T>(): T {
        return { value: 'test' } as T;
      }
    }

    const instance1 = container.get<SingletonScopedConfig>(
      SingletonScopedConfig,
    );
    const instance2 = container.get<SingletonScopedConfig>(
      SingletonScopedConfig,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @config()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public get<T>(): T {
          return { value: 'test' } as T;
        }
      }
    };

    expect(callback).toThrow(
      'Config decorator can only be used on config classes. InvalidClass must end with Config keyword.',
    );
    expect(callback).toThrow(ConfigDecoratorException);
  });

  it('should properly inject dependencies in config classes', () => {
    @config()
    class DependencyConfig {
      public get<T>(): T {
        return { value: 'test' } as T;
      }
    }

    @config()
    class InjectedConfig {
      constructor(
        @inject(DependencyConfig)
        public dependency: DependencyConfig,
      ) {}

      public get<T>(): T {
        return { value: 'test' } as T;
      }
    }

    const instance = container.get<InjectedConfig>(InjectedConfig);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedConfig);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyConfig);
  });
});
