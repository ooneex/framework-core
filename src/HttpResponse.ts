import { CookieMap } from 'bun';
import { Header } from './header/Header';
import {
  STATUS_TEXT,
  isClientErrorStatus,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isSuccessfulStatus,
} from './status';
import type { CharsetType, IRequest, IResponse, StatusCodeType } from './types';

export class HttpResponse implements IResponse {
  private data: Record<string, unknown> = {};
  private message: string | null = null;
  private status: StatusCodeType = 200;
  public readonly header: Header = new Header();
  public readonly cookies: CookieMap;

  constructor(cookie?: CookieMap) {
    this.cookies = cookie || new CookieMap();
  }

  public json(
    data: Record<string, unknown>,
    status: StatusCodeType = 200,
    charset: CharsetType = 'UTF-8',
  ): this {
    this.data = data;
    this.status = status;
    this.header.delete('Accept');
    this.header.delete('Content-Type');
    this.header.add('Accept', 'application/json');
    this.header.contentType('application/json', charset);

    return this;
  }

  public exception(
    message: string,
    data: Record<string, unknown> | null = null,
    status: StatusCodeType = 500,
  ): this {
    this.message = message;
    this.data = data ?? {};
    this.status = status;
    this.header.delete('Accept');
    this.header.delete('Content-Type');
    this.header.add('Accept', 'application/json');
    this.header.contentType('application/json');

    return this;
  }

  public notFound(
    message: string,
    data: Record<string, unknown> | null = null,
    status: StatusCodeType = 404,
  ): this {
    return this.exception(message, data, status);
  }

  public redirect(url: string | URL, status: StatusCodeType = 307): Response {
    return Response.redirect(url, status);
  }

  public isSuccessful(): boolean {
    return isSuccessfulStatus(this.status);
  }

  public isInformational(): boolean {
    return isInformationalStatus(this.status);
  }

  public isRedirect(): boolean {
    return isRedirectStatus(this.status);
  }

  public isClientError(): boolean {
    return isClientErrorStatus(this.status);
  }

  public isServerError(): boolean {
    return isServerErrorStatus(this.status);
  }

  public isError(): boolean {
    return isErrorStatus(this.status);
  }

  public getData(): Record<string, unknown> | ReadableStream | null {
    return this.data;
  }

  public build(request: IRequest): Response {
    const responseOptions = {
      status: this.status,
      statusText: STATUS_TEXT[this.status],
      headers: this.header.native,
    };

    const data = {
      data: this.data,
      message: this.message,
      success: this.isSuccessful(),
      status: this.status,
      path: request.path,
      method: request.method,
      params: request.params,
      payload: request.payload,
      queries: request.queries,
      ip: request.ip,
      host: request.host,
      language: request.language,
    };

    return new Response(JSON.stringify(data), responseOptions);
  }
}
