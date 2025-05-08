import { container } from '../container';
import { EContainerScope } from '../enums';
import type {
  ConfigType,
  ContainerScopeType,
  DatabaseType,
  MailerType,
  MiddlewareType,
  ModelType,
  RepositoryType,
  ServiceType,
  StorageType,
  ValidatorType,
} from '../types';

export const registerWithScope = (
  target:
    | ConfigType
    | DatabaseType
    | MailerType
    | MiddlewareType
    | ModelType
    | RepositoryType
    | ServiceType
    | StorageType
    | ValidatorType,
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
