import { describe, expect, it } from 'bun:test';
import { RoleDecoratorException, container, inject, role } from '@';

describe('Role Decorator', () => {
  it('should register a valid role class in the container', () => {
    @role()
    class TestRole {
      public getRoles(): Promise<string[]> | string[] {
        return ['ROLE_USER', 'ROLE_ADMIN'];
      }
    }

    const instance = container.get<TestRole>(TestRole);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestRole);
    expect(instance.getRoles).toBeFunction();
  });

  it('should register role class with transient scope', () => {
    @role('transient')
    class TransientScopedRole {
      public getRoles(): Promise<string[]> | string[] {
        return ['ROLE_USER', 'ROLE_ADMIN'];
      }
    }

    const instance1 = container.get<TransientScopedRole>(TransientScopedRole);
    const instance2 = container.get<TransientScopedRole>(TransientScopedRole);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register role class with singleton scope by default', () => {
    @role()
    class SingletonScopedRole {
      public getRoles(): Promise<string[]> | string[] {
        return ['ROLE_USER', 'ROLE_ADMIN'];
      }
    }

    const instance1 = container.get<SingletonScopedRole>(SingletonScopedRole);
    const instance2 = container.get<SingletonScopedRole>(SingletonScopedRole);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    const callback = () => {
      @role()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public getRoles(): Promise<string[]> | string[] {
          return ['ROLE_USER', 'ROLE_ADMIN'];
        }
      }
    };

    expect(callback).toThrow(
      'Role decorator can only be used on role classes. InvalidClass must end with Role keyword.',
    );
    expect(callback).toThrow(RoleDecoratorException);
  });

  it('should properly inject dependencies in role classes', () => {
    @role()
    class DependencyRole {
      public getRoles(): Promise<string[]> | string[] {
        return ['ROLE_USER', 'ROLE_ADMIN'];
      }
    }

    @role()
    class InjectedRole {
      constructor(
        @inject(DependencyRole)
        public dependency: DependencyRole,
      ) {}

      public getRoles(): Promise<string[]> | string[] {
        return ['ROLE_USER', 'ROLE_ADMIN'];
      }
    }

    const instance = container.get<InjectedRole>(InjectedRole);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedRole);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyRole);
  });
});
