import { CookieMap, type ErrorLike, type RouterTypes, type Server } from 'bun';
import { HttpResponse } from './HttpResponse';
import { buildContext } from './buildContext';
import { container } from './container';
import { Exception } from './exceptions/Exception';
import { router } from './router/Router';
import {
  buildExecptionDataFromContext,
  runValidators,
} from './router/handleRoute';
import { parseRoutes } from './router/parseRoutes';
import type {
  ContextType,
  ControllerType,
  IRouter,
  MiddlewareScopeType,
  MiddlewareType,
  ModelType,
  ValidationScopeType,
  ValidatorType,
} from './types';
import { parseEnvVars } from './utils/parseEnvVars';

export class App {
  private readonly port: number;
  private readonly hostname: string;
  private readonly router?: IRouter;
  private readonly validators?: Partial<
    Record<Extract<ValidationScopeType, 'env'>, ValidatorType[]>
  >;
  private readonly middlewares?: Partial<
    Record<MiddlewareScopeType, MiddlewareType[]>
  >;
  private readonly notFoundController?: ControllerType;
  private readonly errorController?: ControllerType;

  constructor(config?: {
    port?: number;
    hostname?: string;
    validators?: Partial<
      Record<Extract<ValidationScopeType, 'env'>, (ValidatorType | ModelType)[]>
    >;
    middlewares?: Partial<Record<MiddlewareScopeType, MiddlewareType[]>>;
    router?: IRouter;
    notFoundController?: ControllerType;
    errorController?: ControllerType;
  }) {
    this.port = config?.port || 80;
    this.hostname = config?.hostname || '127.0.0.1';
    this.router = config?.router;
    this.validators = config?.validators;
    this.middlewares = config?.middlewares;

    if (config?.notFoundController) {
      this.notFoundController = config.notFoundController;
      container.bind(this.notFoundController).toSelf().inSingletonScope();
    }

    if (config?.errorController) {
      this.errorController = config.errorController;
      container.bind(this.errorController).toSelf().inSingletonScope();
    }
  }

  public async run(): Promise<Server> {
    const envs = parseEnvVars();
    for (const [key, value] of Object.entries(envs)) {
      container.bind(`env.${key}`).toConstantValue(value);
    }

    const envValidators = this.validators?.env;

    if (envValidators) {
      await runValidators(envValidators, envs);
    }

    const routes = await parseRoutes(this.router || router, {
      middlewares: this.middlewares,
      errorController: this.errorController,
    });

    return Bun.serve({
      port: this.port,
      hostname: this.hostname,
      routes,
      fetch: async (req, server) => {
        class BRequest extends Request {
          params: RouterTypes.ExtractRouteParams<unknown> = {};
          readonly cookies: CookieMap = new CookieMap();

          constructor(
            input: RequestInfo | URL,
            init?: RequestInit,
            config?: {
              params?: RouterTypes.ExtractRouteParams<unknown>;
              cookies?: Record<string, string>;
            },
          ) {
            super(input, init);

            if (config?.params) {
              this.params = config.params;
            }

            if (config?.cookies) {
              this.cookies = new CookieMap(config.cookies);
            }
          }
        }

        const context = await buildContext({
          request: new BRequest(req.url),
          server,
        });

        if (this.notFoundController) {
          const controller = container.get(this.notFoundController);
          const response = await controller.action(context);
          return response.build(context.request);
        }

        context.response.notFound(
          'Route not found',
          buildExecptionDataFromContext(context),
        );

        return context.response.build(context.request);
      },
      error: async (error: ErrorLike) => {
        // @ts-ignore: trust me
        const context: ContextType = {
          state: {},
          response: new HttpResponse(),
          exception: error instanceof Exception ? error : new Exception(error),
          params: {},
          payload: {},
          queries: {},
        };

        const request = {
          path: '',
          method: '',
          params: {},
          payload: {},
          queries: {},
          ip: '',
          host: '',
          language: '',
        };

        if (this.errorController) {
          const controller = container.get(this.errorController);
          const response = await controller.action(context);
          // @ts-ignore: trust me
          return response.build(request);
        }

        context.response.exception(
          'Internal Server Error',
          context.exception?.data,
          context.exception?.status,
        );
        // @ts-ignore: trust me
        return context.response.build(request);
      },
    });
  }
}
