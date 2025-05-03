import type { BunRequest, Server } from 'bun';
import { HttpResponse } from '../HttpResponse';
import { buildContext } from '../buildContext';
import { container } from '../container';
import type {
  ContextType,
  IResponse,
  MiddlewareScopeType,
  MiddlewareType,
  RouteConfigType,
} from '../types';

export const handleRoute = async (config: {
  request: BunRequest;
  server?: Server;
  ip?: string;
  route: RouteConfigType;
  middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;
}): Promise<Response> => {
  let context = await buildContext({
    request: config.request,
    server: config.server,
    ip: config.ip,
  });

  const globalRequestMiddlewares = config.middlewares?.request || [];
  for (const middleware of globalRequestMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  //  TODO: check roles

  const controllerRequestMiddlewares = config.route.middlewares?.request || [];
  for (const middleware of controllerRequestMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  const controllerParamsValidators = config.route.validators?.params || [];
  const controllerPayloadValidators = config.route.validators?.payload || [];
  const controllerQueriesValidators = config.route.validators?.queries || [];

  const controller = container.get(config.route.controller);
  context.response = await controller.action(context);

  const controllerResponseValidators = config.route.validators?.response || [];

  const controllerResponseMiddlewares =
    config.route.middlewares?.response || [];
  for (const middleware of controllerResponseMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  const globalResponseMiddlewares = config.middlewares?.response || [];
  for (const middleware of globalResponseMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  return context.response.build(context.request);
};

const runMiddleware = async (
  middleware: MiddlewareType,
  context: ContextType,
): Promise<ContextType | IResponse> => {
  const instance = container.get(middleware);
  const response = await instance.next(context);
  if (response instanceof HttpResponse) {
    return response;
  }
  context = response as ContextType;

  return context;
};
