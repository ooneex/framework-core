import type { BunRequest, Server } from 'bun';
import { HttpRequest } from './HttpRequest';
import type { ContextType } from './types';
import { parseEnvVars } from './utils/parseEnvVars';

export class App {
  public readonly port: number;
  public readonly hostname: string;

  constructor(config?: { port: number; hostname: string }) {
    this.port = config?.port ?? 80;
    this.hostname = config?.hostname ?? '0.0.0.0';
  }

  async start() {
    // Start the app here
  }
}

const handler = async (req: BunRequest, server: Server) => {
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

  const context: ContextType = {
    state: {},
    request: request,
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
    bearerToken: request.bearerToken,
    envVars: parseEnvVars(),
  };
};
