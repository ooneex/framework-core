import { EContainerScope } from '../enums';
import { DatabaseDecoratorException } from '../exceptions/DatabaseDecoratorException';
import type { ContainerScopeType, DatabaseType } from '../types';
import { registerWithScope } from './registerWithScope';

export const database = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (database: DatabaseType) => {
    const name = database.prototype.constructor.name;

    if (!name.endsWith('Database')) {
      throw new DatabaseDecoratorException(
        `Database decorator can only be used on database classes. ${name} must end with Database keyword.`,
      );
    }

    registerWithScope(database, scope);
  };
};
