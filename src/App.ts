import type {
  IRouter,
  MiddlewareScopeType,
  MiddlewareType,
  ValidationScopeType,
  ValidatorType,
} from './types';

export class App {
  public readonly port: number;
  public readonly hostname: string;
  public readonly router?: IRouter;
  public readonly validators?: Record<ValidationScopeType, ValidatorType[]>;
  public readonly middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;

  // TODO: notFoundController
  // TODO: serverErrorController
  constructor(config?: {
    port?: number;
    hostname?: string;
    validators?: Record<ValidationScopeType, ValidatorType[]>;
    middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;
    isDevelopment?: boolean;
    router?: IRouter;
  }) {
    this.port = config?.port ?? 80;
    this.hostname = config?.hostname ?? '0.0.0.0';
    this.router = config?.router;
    this.validators = config?.validators;
    this.middlewares = config?.middlewares;
  }

  async run() {
    // TODO: Call validators
  }
}
