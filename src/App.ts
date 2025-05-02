import type {
  ILogger,
  MiddlewareScopeType,
  MiddlewareType,
  ValidationScopeType,
  ValidatorType,
} from './types';

export class App {
  public readonly port: number;
  public readonly logger?: ILogger;
  public readonly hostname: string;
  public readonly isDevelopment: boolean;
  public readonly validators?: Record<ValidationScopeType, ValidatorType[]>;
  public readonly middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;

  // validate envVars
  constructor(config?: {
    port?: number;
    logger?: ILogger;
    hostname?: string;
    validators?: Record<ValidationScopeType, ValidatorType[]>;
    middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;
    isDevelopment?: boolean;
  }) {
    this.logger = config?.logger;
    this.port = config?.port ?? 80;
    this.hostname = config?.hostname ?? '0.0.0.0';
    this.validators = config?.validators;
    this.middlewares = config?.middlewares;
    this.isDevelopment = config?.isDevelopment ?? false;
  }

  async run() {
    // Start the app here
  }
}
