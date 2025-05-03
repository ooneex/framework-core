import type { BunRequest, Server } from 'bun';
import type {
  IRouter,
  MethodType,
  MiddlewareScopeType,
  MiddlewareType,
} from '../types';
import { handleRoute } from './handleRoute';

export const parseRoutes = async (
  router: IRouter,
  config?: { middlewares?: Record<MiddlewareScopeType, MiddlewareType[]> },
) => {
  const result: Record<
    string,
    Partial<
      Record<
        MethodType,
        (request: BunRequest, server: Server) => Promise<Response>
      >
    >
  > = {};

  for (const [path, routes] of router.getRoutes()[Symbol.iterator]()) {
    if (!result[path]) {
      result[path] = {};
    }

    for (const route of routes[Symbol.iterator]()) {
      result[path][route.method] = async (
        request: BunRequest,
        server: Server,
      ) =>
        await handleRoute({
          request,
          server,
          route,
          middlewares: config?.middlewares,
        });
    }
  }

  return result;
};
