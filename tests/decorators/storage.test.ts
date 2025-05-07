import { describe, expect, it } from 'bun:test';
import { StorageDecoratorException, container, inject, storage } from '@';

describe('Storage Decorator', () => {
  it('should register a valid storage class in the container', () => {
    @storage()
    class TestStorage {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance = container.get<TestStorage>(TestStorage);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestStorage);
    expect(instance.beforeValidation).toBeFunction();
  });

  it('should register storage class with transient scope', () => {
    @storage('transient')
    class TransientScopedStorage {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance1 = container.get<TransientScopedStorage>(
      TransientScopedStorage,
    );
    const instance2 = container.get<TransientScopedStorage>(
      TransientScopedStorage,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register storage class with request scope', () => {
    @storage('request')
    class RequestScopedStorage {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance1 = container.get<RequestScopedStorage>(RequestScopedStorage);
    const instance2 = container.get<RequestScopedStorage>(RequestScopedStorage);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register storage class with singleton scope by default', () => {
    @storage()
    class SingletonScopedStorage {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance1 = container.get<SingletonScopedStorage>(
      SingletonScopedStorage,
    );
    const instance2 = container.get<SingletonScopedStorage>(
      SingletonScopedStorage,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @storage()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public beforeValidation(data: any): Promise<any> | any {
          return data;
        }
      }
    };

    expect(callback).toThrow(
      'Storage decorator can only be used on storage classes. InvalidClass must end with Storage keyword.',
    );
    expect(callback).toThrow(StorageDecoratorException);
  });

  it('should properly inject dependencies in storage classes', () => {
    @storage()
    class DependencyStorage {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    @storage()
    class InjectedStorage {
      constructor(
        @inject(DependencyStorage)
        public dependency: DependencyStorage,
      ) {}

      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance = container.get<InjectedStorage>(InjectedStorage);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedStorage);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyStorage);
  });
});
