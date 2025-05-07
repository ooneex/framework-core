import type { BunRequest, Server } from 'bun';
import { buildContext } from '../buildContext';
import type {
  ControllerType,
  IRouter,
  MethodType,
  MiddlewareScopeType,
  MiddlewareType,
} from '../types';
import { buildErrorResponse, handleRoute } from './handleRoute';

export const parseRoutes = async (
  router: IRouter,
  config?: {
    middlewares?: Partial<Record<MiddlewareScopeType, MiddlewareType[]>>;
    errorController?: ControllerType;
  },
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
      ) => {
        const context = await buildContext({
          request,
          server,
          route: route,
        });

        try {
          return await handleRoute({
            context,
            middlewares: config?.middlewares,
          });
        } catch (error: any) {
          return await buildErrorResponse({
            error,
            context,
            errorController: config?.errorController,
          });
        }
      };
    }
  }

  return result;
};
