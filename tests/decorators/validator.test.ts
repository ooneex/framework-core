import { describe, expect, it } from 'bun:test';
import { ValidatorDecoratorException, container, inject, validator } from '@';

describe('Validator Decorator', () => {
  it('should register a valid validator class in the container', () => {
    @validator()
    class TestValidator {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance = container.get<TestValidator>(TestValidator);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestValidator);
    expect(instance.beforeValidation).toBeFunction();
  });

  it('should register validator class with transient scope', () => {
    @validator('transient')
    class TransientScopedValidator {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance1 = container.get<TransientScopedValidator>(
      TransientScopedValidator,
    );
    const instance2 = container.get<TransientScopedValidator>(
      TransientScopedValidator,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register validator class with request scope', () => {
    @validator('request')
    class RequestScopedValidator {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance1 = container.get<RequestScopedValidator>(
      RequestScopedValidator,
    );
    const instance2 = container.get<RequestScopedValidator>(
      RequestScopedValidator,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register validator class with singleton scope by default', () => {
    @validator()
    class SingletonScopedValidator {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance1 = container.get<SingletonScopedValidator>(
      SingletonScopedValidator,
    );
    const instance2 = container.get<SingletonScopedValidator>(
      SingletonScopedValidator,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @validator()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public beforeValidation(data: any): Promise<any> | any {
          return data;
        }
      }
    };

    expect(callback).toThrow(
      'Validator decorator can only be used on validator classes. InvalidClass must end with Validator keyword.',
    );
    expect(callback).toThrow(ValidatorDecoratorException);
  });

  it('should properly inject dependencies in validator classes', () => {
    @validator()
    class DependencyValidator {
      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    @validator()
    class InjectedValidator {
      constructor(
        @inject(DependencyValidator)
        public dependency: DependencyValidator,
      ) {}

      public beforeValidation(data: any): Promise<any> | any {
        return data;
      }
    }

    const instance = container.get<InjectedValidator>(InjectedValidator);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedValidator);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyValidator);
  });
});
