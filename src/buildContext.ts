import type { BunRequest, Server } from 'bun';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import type { ContextType, RouteConfigType } from './types';

export const buildContext = async (config: {
  request: BunRequest;
  server?: Server;
  ip?: string;
  route?: RouteConfigType;
}): Promise<ContextType> => {
  const req = config.request;

  let payload = {};
  let form: FormData | null = null;

  try {
    payload = await req.json();
  } catch (_e) {}

  try {
    form = await req.formData();
  } catch (_e) {}

  const ip = config.server?.requestIP(req)?.address || config.ip || 'unknown';

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
    params: request.params,
    payload: request.payload,
    queries: request.queries,
    files: request.files,
    cookies: request.cookies,
    form: request.form,
    language: request.language,
    path: request.path,
    method: request.method,
    header: request.header,
    ip: request.ip,
    host: request.host,
    route: config.route,
  };
};
