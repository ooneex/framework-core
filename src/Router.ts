import { RouterException } from './exception/RouterException';
import type { RouteConfigType } from './types';

export class Router {
  private routes: Map<string, RouteConfigType[]> = new Map();

  public addRoute(route: RouteConfigType): this {
    const name = route.name;

    for (const item of this.routes[Symbol.iterator]()) {
      const existingRoute = item[1].find((r) => r.name === name);

      if (existingRoute) {
        throw new RouterException(`Route with name '${name}' already exists`);
      }
    }

    const routes = this.routes.get(route.path) ?? [];
    routes.push(route);
    this.routes.set(route.path, routes);

    return this;
  }

  public findRouteByPath(path: string): RouteConfigType[] | null {
    return this.routes.get(path) ?? null;
  }

  public findRouteByName(name: string): RouteConfigType | null {
    for (const item of this.routes[Symbol.iterator]()) {
      const existingRoute = item[1].find((r) => r.name === name);

      if (existingRoute) {
        return existingRoute;
      }
    }

    return null;
  }

  public getRoutes(): Map<string, RouteConfigType[]> {
    return this.routes;
  }
}

export const router = new Router();
