import { router } from './Router';
import { container } from './container';
import { ContainerScope } from './enums';
import { ConfigDecoratorException } from './exception/ConfigDecoratorException';
import { DatabaseDecoratorException } from './exception/DatabaseDecoratorException';
import { MailerDecoratorException } from './exception/MailerDecoratorException';
import { ServiceDecoratorException } from './exception/ServiceDecoratorException';
import type {
  ConfigDecoratorType,
  ContainerScopeType,
  ControllerDecoratorType,
  DatabaseDecoratorType,
  MailerDecoratorType,
  RouteConfigType,
  ServiceDecoratorType,
} from './types';

export const Route = {
  get: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'GET',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
  post: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'POST',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
  put: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'PUT',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
  delete: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'DELETE',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
  patch: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'PATCH',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
  options: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'OPTIONS',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
  head: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerDecoratorType) => {
      router.addRoute({
        path,
        method: 'HEAD',
        name: Bun.randomUUIDv7(),
        ...(config || {}),
        controller: construct,
      });
    };
  },
};

const registerWithScope = (
  target:
    | ConfigDecoratorType
    | ServiceDecoratorType
    | DatabaseDecoratorType
    | MailerDecoratorType,
  scope: ContainerScopeType = ContainerScope.Singleton,
) => {
  const binding = container.bind(target).toSelf();

  switch (scope) {
    case ContainerScope.Request:
      binding.inRequestScope();
      break;
    case ContainerScope.Transient:
      binding.inTransientScope();
      break;
    default:
      binding.inSingletonScope();
  }
};

export const config = (
  scope: ContainerScopeType = ContainerScope.Singleton,
) => {
  return (config: ConfigDecoratorType) => {
    const name = config.prototype.constructor.name;

    if (!name.endsWith('Config')) {
      throw new ConfigDecoratorException(
        `Config decorator can only be used on config classes. ${name} must end with Config keyword.`,
      );
    }

    registerWithScope(config, scope);
  };
};

export const service = (
  scope: ContainerScopeType = ContainerScope.Singleton,
) => {
  return (service: ServiceDecoratorType) => {
    const name = service.prototype.constructor.name;

    if (!name.endsWith('Service')) {
      throw new ServiceDecoratorException(
        `Service decorator can only be used on service classes. ${name} must end with Service keyword.`,
      );
    }

    registerWithScope(service, scope);
  };
};

export const database = (
  scope: ContainerScopeType = ContainerScope.Singleton,
) => {
  return (database: DatabaseDecoratorType) => {
    const name = database.prototype.constructor.name;

    if (!name.endsWith('Database')) {
      throw new DatabaseDecoratorException(
        `Database decorator can only be used on database classes. ${name} must end with Database keyword.`,
      );
    }

    registerWithScope(database, scope);
  };
};

export const mailer = (
  scope: ContainerScopeType = ContainerScope.Singleton,
) => {
  return (mailer: MailerDecoratorType) => {
    const name = mailer.prototype.constructor.name;

    if (!name.endsWith('Mailer')) {
      throw new MailerDecoratorException(
        `Mailer decorator can only be used on mailer classes. ${name} must end with Mailer keyword.`,
      );
    }

    registerWithScope(mailer, scope);
  };
};
