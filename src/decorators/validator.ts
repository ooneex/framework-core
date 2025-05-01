import { EContainerScope } from '../enums';
import { ValidatorDecoratorException } from '../exceptions/ValidatorDecoratorException';
import type { ContainerScopeType, ValidatorType } from '../types';
import { registerWithScope } from './registerWithScope';

// TODO: Unit tests
export const validator = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (validator: ValidatorType) => {
    const name = validator.prototype.constructor.name;

    if (!name.endsWith('Validator')) {
      throw new ValidatorDecoratorException(
        `Validator decorator can only be used on validator classes. ${name} must end with Validator keyword.`,
      );
    }

    registerWithScope(validator, scope);
  };
};
