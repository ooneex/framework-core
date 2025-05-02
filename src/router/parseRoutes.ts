import type { BunRequest, Server } from 'bun';
import type { MethodType } from '../types';
import type { Router } from './Router';
import { handleRoute } from './handleRoute';

export const parseRoutes = async (router: Router) => {
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
      ) => handleRoute({ request, server, route });
    }
  }

  return result;
};
