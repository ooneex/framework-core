import { EContainerScope } from '../enums';
import { RoleDecoratorException } from '../exceptions/RoleDecoratorException';
import type { ContainerScopeType, RoleType } from '../types';
import { registerWithScope } from './registerWithScope';

// TODO: Unit tests
export const role = (scope: ContainerScopeType = EContainerScope.Singleton) => {
  return (role: RoleType) => {
    const name = role.prototype.constructor.name;

    if (!name.endsWith('Role')) {
      throw new RoleDecoratorException(
        `Role decorator can only be used on role classes. ${name} must end with Role keyword.`,
      );
    }

    registerWithScope(role, scope);
  };
};
