import type { BunRequest, Server } from 'bun';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import type {
  ContextType,
  MiddlewareScopeType,
  MiddlewareType,
  ValidationScopeType,
  ValidatorType,
} from './types';

export class App {
  public readonly port: number;
  public readonly hostname: string;
  public readonly isDevelopment: boolean;
  public readonly validators?: Record<ValidationScopeType, ValidatorType[]>;
  public readonly middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;

  // validate envVars
  constructor(config?: {
    port?: number;
    hostname?: string;
    validators?: Record<ValidationScopeType, ValidatorType[]>;
    middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;
    isDevelopment?: boolean;
  }) {
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

const handler = async (config: {
  req: BunRequest;
  server: Server;
}) => {
  const req = config.req;
  const server = config.server;

  let payload = {};
  let form: FormData | null = null;

  try {
    payload = await req.json();
  } catch (_e) {}

  try {
    form = await req.formData();
  } catch (_e) {}

  const ip = server.requestIP(req)?.address as string;

  const request = new HttpRequest(req, {
    ip,
    payload,
    form,
  });

  const response = new HttpResponse(request.cookies);

  const context: ContextType = {
    state: {},
    request: request,
    response: response,
    exception: null,
    params: request.params,
    payload: request.payload,
    queries: request.queries,
    cookies: request.cookies,
    form: request.form,
    language: request.language,
    path: request.path,
    method: request.method,
    header: request.header,
    ip: request.ip,
    host: request.host,
  };
};
