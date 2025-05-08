import { EContainerScope } from '../enums';
import { ControllerDecoratorException } from '../exceptions/ControllerDecoratorException';
import { router } from '../router/Router';
import type {
  ContainerScopeType,
  ControllerType,
  RouteConfigType,
} from '../types';
import { registerWithScope } from './registerWithScope';

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
  notFound: (scope: ContainerScopeType = EContainerScope.Singleton) => {
    return (notFound: ControllerType) => {
      const name = notFound.prototype.constructor.name;

      if (!name.endsWith('Controller')) {
        throw new ControllerDecoratorException(
          `NotFound decorator can only be used on controller classes. ${name} must end with Controller keyword.`,
        );
      }

      registerWithScope(notFound, scope);
    };
  },
  serverError: (scope: ContainerScopeType = EContainerScope.Singleton) => {
    return (notFound: ControllerType) => {
      const name = notFound.prototype.constructor.name;

      if (!name.endsWith('Controller')) {
        throw new ControllerDecoratorException(
          `ServerError decorator can only be used on controller classes. ${name} must end with Controller keyword.`,
        );
      }

      registerWithScope(notFound, scope);
    };
  },
};
