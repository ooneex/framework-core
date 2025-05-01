import { EContainerScope } from '../enums';
import { MiddlewareDecoratorException } from '../exceptions/MiddlewareDecoratorException';
import type { ContainerScopeType, MiddlewareType } from '../types';
import { registerWithScope } from './registerWithScope';

export const middleware = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (middleware: MiddlewareType) => {
    const name = middleware.prototype.constructor.name;

    if (!name.endsWith('Middleware')) {
      throw new MiddlewareDecoratorException(
        `Middleware decorator can only be used on middleware classes. ${name} must end with Middleware keyword.`,
      );
    }

    registerWithScope(middleware, scope);
  };
};
