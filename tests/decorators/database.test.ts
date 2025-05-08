import { describe, expect, it } from 'bun:test';
import { DatabaseDecoratorException, container, database, inject } from '@';

describe('Database Decorator', () => {
  it('should register a valid database class in the container', () => {
    @database()
    class TestDatabase {}

    const instance = container.get<TestDatabase>(TestDatabase);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestDatabase);
  });

  it('should register database class with transient scope', () => {
    @database('transient')
    class TransientScopedDatabase {}

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

  it('should register database class with request scope', () => {
    @database('request')
    class RequestScopedDatabase {}

    const instance1 = container.get<RequestScopedDatabase>(
      RequestScopedDatabase,
    );
    const instance2 = container.get<RequestScopedDatabase>(
      RequestScopedDatabase,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register database class with singleton scope by default', () => {
    @database()
    class SingletonScopedDatabase {}

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
      class InvalidClass {}
    };

    expect(callback).toThrow(
      'Database decorator can only be used on database classes. InvalidClass must end with Database keyword.',
    );
    expect(callback).toThrow(DatabaseDecoratorException);
  });

  it('should properly inject dependencies in database classes', () => {
    @database()
    class DependencyDatabase {}

    @database()
    class InjectedDatabase {
      constructor(
        @inject(DependencyDatabase)
        public dependency: DependencyDatabase,
      ) {}
    }

    const instance = container.get<InjectedDatabase>(InjectedDatabase);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedDatabase);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyDatabase);
  });
});
