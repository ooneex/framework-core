import type { BunRequest, CookieMap } from 'bun';
import type { Env } from './enums';
import type { Exception } from './exception/Exception';
import type { HEADERS } from './headers';
import type { LOCALES } from './locales';
import type { MIME_TYPES } from './mimes';
import type { StatusCode, StatusText } from './status';

export type ScalarType = boolean | number | bigint | string;

export type EnvType = `${Env}`;

export type MethodType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD';

export type EncodingType =
  | 'deflate'
  | 'gzip'
  | 'compress'
  | 'br'
  | 'identity'
  | '*';

export type CharsetType =
  | 'ISO-8859-1'
  | '7-BIT'
  | 'UTF-8'
  | 'UTF-16'
  | 'US-ASCII';

export type MimeType = (typeof MIME_TYPES)[number];
export type HeaderFieldType = (typeof HEADERS)[number] | `X-Custom-${string}`;

export type RouteConfigType = {
  path: `/${string}`;
  method: MethodType;
};

export type ControllerActionArgsType = (
  path: string,
  method: MethodType,
) => MethodDecorator;

export type { StatusCode as StatusCodeType };
export type { StatusText as StatusTextType };

export type ContextType<
  State = Record<string, unknown>,
  Params = Record<string, ScalarType>,
  Payload = Record<string, unknown>,
  Queries = Record<string, ScalarType>,
  EnvVars = Record<string, ScalarType>,
> = {
  state: State;
  request: IRequest;
  exception: Exception | null;
  params: Params;
  payload: Payload;
  queries: Queries;
  cookies: CookieMap | null;
  form: FormData | null;
  language: LanguageType;
  path: string;
  method: MethodType;
  header: IReadonlyHeader;
  ip: string;
  host: string;
  bearerToken: string | null;
  envVars: EnvVars;

  // user?: IUser;
  // isAuthenticated?: boolean;
  // response: HttpResponse;
  // files?: Record<string, unknown>;
};

export interface IUrl {
  readonly protocol: string;
  readonly subdomain: string | null;
  readonly domain: string;
  readonly port: number;
  readonly path: string;
  readonly queries: Record<string, ScalarType>;
  readonly fragment: string;
  readonly base: string;
  readonly origin: string;
  readonly native: URL;
}

export type LocaleType = (typeof LOCALES)[number];

export type LanguageType = {
  code: LocaleType;
  region: string | null;
};

export interface IRequest {
  readonly path: string;
  readonly url: IUrl;
  readonly method: MethodType;
  readonly header: IReadonlyHeader;
  readonly params: Record<string, ScalarType>;
  readonly payload: Record<string, unknown>;
  readonly queries: Record<string, ScalarType>;
  readonly cookies: CookieMap;
  readonly form: FormData | null;
  readonly ip: string;
  readonly host: string;
  readonly referer: string | null;
  readonly bearerToken: string | null;
  readonly language: LanguageType | null;
  readonly native: Readonly<BunRequest>;
}

export interface IHeaderChecker {
  isBlob: () => boolean;
  isJson: () => boolean;
  isStream: () => boolean;
  isText: () => boolean;
  isFormData: () => boolean;
  isHtml: () => boolean;
}

export interface IReadonlyHeader extends IHeaderChecker {
  readonly native: Headers;
  get: (name: HeaderFieldType) => string | null;
  getAllow: () => MethodType[] | null;
  getAccept: () => MimeType | '*/*' | null;
  getAcceptEncoding: () => EncodingType[] | null;
  getContentLength: () => number | null;
  getContentType: () => string | null;
  getContentDisposition: () => string | null;
  getAuthorization: () => string | null;
  getBasicAuth: () => string | null;
  getBearerToken: () => string | null;
  getHost: () => string;
  getIp: () => string;
  getReferer: () => string | null;
  getRefererPolicy: () => string | null;
  getCharset: () => CharsetType | null;
  getCacheControl: () => string | null;
  getEtag: () => string | null;
  has: (name: HeaderFieldType) => boolean;
  [Symbol.iterator](): IterableIterator<[HeaderFieldType, string]>;
  toJson: () => Record<HeaderFieldType, string>;
}

export interface IHeader extends IReadonlyHeader {
  readonly native: Headers;
}
