import { describe, expect, it } from 'bun:test';
import { ServiceDecoratorException, container, service } from '@';

describe('Service Decorator', () => {
  it('should throw error if class name does not end with Service', () => {
    const callback = () => {
      @service()
      // biome-ignore lint/correctness/noUnusedVariables: <explanation>
      class InvalidClass {
        public execute<T>(): T {
          return 'execute' as T;
        }
      }
    };

    expect(callback).toThrow(ServiceDecoratorException);

    expect(callback).toThrow(
      'Service decorator can only be used on service classes. InvalidClass must end with Service keyword.',
    );
  });

  it('should not throw error if class name ends with Service', () => {
    expect(() => {
      @service()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class ValidService {
        public execute<T>(): T {
          return 'execute' as T;
        }
      }
    }).not.toThrow();
  });

  it('should register services', () => {
    @service()
    class TestService {
      public execute<T>(): T {
        return 'execute' as T;
      }
    }

    const instance = container.get<TestService>(TestService);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestService);
  });
});
