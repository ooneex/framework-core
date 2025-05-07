import { describe, expect, it } from 'bun:test';
import { RepositoryDecoratorException, container, inject, repository } from '@';

describe('Repository Decorator', () => {
  it('should register a valid repository class in the container', () => {
    @repository()
    class TestRepository {
      public get<T = string>(id: string): T {
        return id as T;
      }
    }

    const instance = container.get<TestRepository>(TestRepository);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestRepository);
    expect(instance.get).toBeFunction();
  });

  it('should register repository class with transient scope', () => {
    @repository('transient')
    class TransientScopedRepository {
      public get<T = string>(id: string): T {
        return id as T;
      }
    }

    const instance1 = container.get<TransientScopedRepository>(
      TransientScopedRepository,
    );
    const instance2 = container.get<TransientScopedRepository>(
      TransientScopedRepository,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register repository class with request scope', () => {
    @repository('request')
    class RequestScopedRepository {
      public get<T = string>(id: string): T {
        return id as T;
      }
    }

    const instance1 = container.get<RequestScopedRepository>(
      RequestScopedRepository,
    );
    const instance2 = container.get<RequestScopedRepository>(
      RequestScopedRepository,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register repository class with singleton scope by default', () => {
    @repository()
    class SingletonScopedRepository {
      public get<T = string>(id: string): T {
        return id as T;
      }
    }

    const instance1 = container.get<SingletonScopedRepository>(
      SingletonScopedRepository,
    );
    const instance2 = container.get<SingletonScopedRepository>(
      SingletonScopedRepository,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @repository()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public get<T = string>(id: string): T {
          return id as T;
        }
      }
    };

    expect(callback).toThrow(
      'Repository decorator can only be used on repository classes. InvalidClass must end with Repository keyword.',
    );
    expect(callback).toThrow(RepositoryDecoratorException);
  });

  it('should properly inject dependencies in repository classes', () => {
    @repository()
    class DependencyRepository {
      public get<T = string>(id: string): T {
        return id as T;
      }
    }

    @repository()
    class InjectedRepository {
      constructor(
        @inject(DependencyRepository)
        public dependency: DependencyRepository,
      ) {}

      public get<T = string>(id: string): T {
        return id as T;
      }
    }

    const instance = container.get<InjectedRepository>(InjectedRepository);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedRepository);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyRepository);
  });
});
