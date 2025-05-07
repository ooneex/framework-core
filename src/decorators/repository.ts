import { EContainerScope } from '../enums';
import { RepositoryDecoratorException } from '../exceptions/RepositoryDecoratorException';
import type { ContainerScopeType, RepositoryType } from '../types';
import { registerWithScope } from './registerWithScope';

export const repository = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (repository: RepositoryType) => {
    const name = repository.prototype.constructor.name;

    if (!name.endsWith('Repository')) {
      throw new RepositoryDecoratorException(
        `Repository decorator can only be used on repository classes. ${name} must end with Repository keyword.`,
      );
    }

    registerWithScope(repository, scope);
  };
};
