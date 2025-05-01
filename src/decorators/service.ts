import { EContainerScope } from '../enums';
import { ServiceDecoratorException } from '../exceptions/ServiceDecoratorException';
import type { ContainerScopeType, ServiceType } from '../types';
import { registerWithScope } from './registerWithScope';

export const service = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (service: ServiceType) => {
    const name = service.prototype.constructor.name;

    if (!name.endsWith('Service')) {
      throw new ServiceDecoratorException(
        `Service decorator can only be used on service classes. ${name} must end with Service keyword.`,
      );
    }

    registerWithScope(service, scope);
  };
};
