import type { BunRequest, Server } from 'bun';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import type { ContextType } from './types';

export const createContext = async (config: {
  req: BunRequest;
  server: Server;
}): Promise<ContextType> => {
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

  return {
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
