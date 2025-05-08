import { EContainerScope } from '../enums';
import { ModelDecoratorException } from '../exceptions/ModelDecoratorException';
import type { ContainerScopeType, ModelType } from '../types';
import { registerWithScope } from './registerWithScope';

export const model = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (model: ModelType) => {
    const name = model.prototype.constructor.name;

    if (!name.endsWith('Model')) {
      throw new ModelDecoratorException(
        `Model decorator can only be used on model classes. ${name} must end with Model keyword.`,
      );
    }

    registerWithScope(model, scope);
  };
};
