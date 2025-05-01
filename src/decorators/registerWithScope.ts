import { container } from '../container';
import { EContainerScope } from '../enums';
import type {
  ConfigType,
  ContainerScopeType,
  DatabaseType,
  MailerType,
  MiddlewareType,
  RoleType,
  ServiceType,
  ValidatorType,
} from '../types';

export const registerWithScope = (
  target:
    | ConfigType
    | ServiceType
    | DatabaseType
    | MailerType
    | MiddlewareType
    | ValidatorType
    | RoleType,
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  const binding = container.bind(target).toSelf();

  switch (scope) {
    case EContainerScope.Request:
      binding.inRequestScope();
      break;
    case EContainerScope.Transient:
      binding.inTransientScope();
      break;
    default:
      binding.inSingletonScope();
  }
};
