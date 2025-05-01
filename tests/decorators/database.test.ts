import { describe, expect, it } from 'bun:test';
import { DatabaseDecoratorException, container, database, inject } from '@';

describe('Database Decorator', () => {
  it('should register a valid database class in the container', () => {
    @database()
    class TestDatabase {
      public open<T>(): T {
        return 'open' as T;
      }

      public close<T>(): T {
        return 'close' as T;
      }
    }

    const instance = container.get<TestDatabase>(TestDatabase);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestDatabase);
    expect(instance.open<string>()).toBe('open');
    expect(instance.close<string>()).toBe('close');
  });

  it('should register database class with transient scope', () => {
    @database('transient')
    class TransientScopedDatabase {
      public open<T>(): T {
        return 'open' as T;
      }

      public close<T>(): T {
        return 'close' as T;
      }
    }

    const instance1 = container.get<TransientScopedDatabase>(
      TransientScopedDatabase,
    );
    const instance2 = container.get<TransientScopedDatabase>(
      TransientScopedDatabase,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register database class with singleton scope by default', () => {
    @database()
    class SingletonScopedDatabase {
      public open<T>(): T {
        return 'open' as T;
      }

      public close<T>(): T {
        return 'close' as T;
      }
    }

    const instance1 = container.get<SingletonScopedDatabase>(
      SingletonScopedDatabase,
    );
    const instance2 = container.get<SingletonScopedDatabase>(
      SingletonScopedDatabase,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @database()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public open<T>(): T {
          return 'open' as T;
        }

        public close<T>(): T {
          return 'close' as T;
        }
      }
    };

    expect(callback).toThrow(
      'Database decorator can only be used on database classes. InvalidClass must end with Database keyword.',
    );
    expect(callback).toThrow(DatabaseDecoratorException);
  });

  it('should properly inject dependencies in database classes', () => {
    @database()
    class DependencyDatabase {
      public open<T>(): T {
        return 'open' as T;
      }

      public close<T>(): T {
        return 'close' as T;
      }
    }

    @database()
    class InjectedDatabase {
      constructor(
        @inject(DependencyDatabase)
        public dependency: DependencyDatabase,
      ) {}

      public open<T>(): T {
        return 'open' as T;
      }

      public close<T>(): T {
        return 'close' as T;
      }
    }

    const instance = container.get<InjectedDatabase>(InjectedDatabase);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedDatabase);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyDatabase);
  });
});
