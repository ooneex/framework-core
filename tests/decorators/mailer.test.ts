import { describe, expect, it } from 'bun:test';
import { MailerDecoratorException, container, inject, mailer } from '@';

describe('Mailer Decorator', () => {
  it('should register a valid mailer class in the container', () => {
    @mailer()
    class TestMailer {
      public send<T>(): T {
        return 'sent' as T;
      }
    }

    const instance = container.get<TestMailer>(TestMailer);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestMailer);
    expect(instance.send<string>()).toBe('sent');
  });

  it('should register mailer class with transient scope', () => {
    @mailer('transient')
    class TransientScopedMailer {
      public send<T>(): T {
        return 'sent' as T;
      }
    }

    const instance1 = container.get<TransientScopedMailer>(
      TransientScopedMailer,
    );
    const instance2 = container.get<TransientScopedMailer>(
      TransientScopedMailer,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register mailer class with request scope', () => {
    @mailer('request')
    class RequestScopedMailer {
      public send<T>(): T {
        return 'sent' as T;
      }
    }

    const instance1 = container.get<RequestScopedMailer>(RequestScopedMailer);
    const instance2 = container.get<RequestScopedMailer>(RequestScopedMailer);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register mailer class with singleton scope by default', () => {
    @mailer()
    class SingletonScopedMailer {
      public send<T>(): T {
        return 'sent' as T;
      }
    }

    const instance1 = container.get<SingletonScopedMailer>(
      SingletonScopedMailer,
    );
    const instance2 = container.get<SingletonScopedMailer>(
      SingletonScopedMailer,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @mailer()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public send<T>(): T {
          return 'sent' as T;
        }
      }
    };

    expect(callback).toThrow(
      'Mailer decorator can only be used on mailer classes. InvalidClass must end with Mailer keyword.',
    );
    expect(callback).toThrow(MailerDecoratorException);
  });

  it('should properly inject dependencies in mailer classes', () => {
    @mailer()
    class DependencyMailer {
      public send<T>(): T {
        return 'sent' as T;
      }
    }

    @mailer()
    class InjectedMailer {
      constructor(
        @inject(DependencyMailer)
        public dependency: DependencyMailer,
      ) {}

      public send<T>(): T {
        return 'sent' as T;
      }
    }

    const instance = container.get<InjectedMailer>(InjectedMailer);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedMailer);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyMailer);
  });
});
