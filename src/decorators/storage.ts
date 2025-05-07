import { EContainerScope } from '../enums';
import { StorageDecoratorException } from '../exceptions/StorageDecoratorException';
import type { ContainerScopeType, StorageType } from '../types';
import { registerWithScope } from './registerWithScope';

export const storage = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (storage: StorageType) => {
    const name = storage.prototype.constructor.name;

    if (!name.endsWith('Storage')) {
      throw new StorageDecoratorException(
        `Storage decorator can only be used on storage classes. ${name} must end with Storage keyword.`,
      );
    }

    registerWithScope(storage, scope);
  };
};
