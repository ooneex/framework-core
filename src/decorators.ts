import { router } from './Router';
import { container } from './container';
import { ContainerScope } from './enums';
import { ConfigDecoratorException } from './exceptions/ConfigDecoratorException';
import { DatabaseDecoratorException } from './exceptions/DatabaseDecoratorException';
import { MailerDecoratorException } from './exceptions/MailerDecoratorException';
import { MiddlewareDecoratorException } from './exceptions/MiddlewareDecoratorException';
import { RoleDecoratorException } from './exceptions/RoleDecoratorException';
import { ServiceDecoratorException } from './exceptions/ServiceDecoratorException';
import { ValidatorDecoratorException } from './exceptions/ValidatorDecoratorException';
import type {
  ConfigType,
  ContainerScopeType,
  ControllerType,
  DatabaseType,
  MailerType,
  MiddlewareType,
  RoleType,
  RouteConfigType,
  ServiceType,
  ValidatorType,
} from './types';

export const Route = {
  get: (
    path: `/${string}`,
    config?: Omit<RouteConfigType, 'path' | 'method' | 'controller'>,
  ) => {
    return (construct: ControllerType) => {
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
    return (construct: ControllerType) => {
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
    return (construct: ControllerType) => {
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
    return (construct: ControllerType) => {
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
    return (construct: ControllerType) => {
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
    return (construct: ControllerType) => {
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
    return (construct: ControllerType) => {
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
    | ConfigType
    | ServiceType
    | DatabaseType
    | MailerType
    | MiddlewareType
    | ValidatorType
    | RoleType,
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
  return (config: ConfigType) => {
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

export const database = (
  scope: ContainerScopeType = ContainerScope.Singleton,
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

export const mailer = (
  scope: ContainerScopeType = ContainerScope.Singleton,
) => {
  return (mailer: MailerType) => {
    const name = mailer.prototype.constructor.name;

    if (!name.endsWith('Mailer')) {
      throw new MailerDecoratorException(
        `Mailer decorator can only be used on mailer classes. ${name} must end with Mailer keyword.`,
      );
    }

    registerWithScope(mailer, scope);
  };
};

// TODO: Unit tests
export const middleware = (
  scope: ContainerScopeType = ContainerScope.Singleton,
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

// TODO: Unit tests
export const validator = (
  scope: ContainerScopeType = ContainerScope.Singleton,
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

// TODO: Unit tests
export const role = (scope: ContainerScopeType = ContainerScope.Singleton) => {
  return (role: RoleType) => {
    const name = role.prototype.constructor.name;

    if (!name.endsWith('Role')) {
      throw new RoleDecoratorException(
        `Role decorator can only be used on role classes. ${name} must end with Role keyword.`,
      );
    }

    registerWithScope(role, scope);
  };
};
