import type { BunRequest, CookieMap } from 'bun';
import type { BunFile, S3File, S3Options } from 'bun';
import type { EContainerScope, EMiddlewareScope, EScope, Env } from './enums';
import type { Exception } from './exceptions/Exception';
import type { HEADERS } from './headers';
import type { LOCALES } from './locales';
import type { MIME_TYPES } from './mimes';
import type { STATUS_CODE, STATUS_TEXT } from './status';

export type { BunFile, S3File, S3Options };
export type ScalarType = boolean | number | bigint | string;
export type EnvType = `${Env}`;
export type ScopeType = `${EScope}`;
export type MiddlewareScopeType = `${EMiddlewareScope}`;
export type ContainerScopeType = `${EContainerScope}`;

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
  name?: string;
  path: `/${string}`;
  method: MethodType;
  validators?: Partial<Record<ValidationScopeType, ValidatorType[]>>;
  middlewares?: Partial<Record<MiddlewareScopeType, MiddlewareType[]>>;
  roles?: RoleType[];
  controller: ControllerType;
  description?: string;
};

export type StatusCodeType = (typeof STATUS_CODE)[keyof typeof STATUS_CODE];
export type StatusTextType = (typeof STATUS_TEXT)[keyof typeof STATUS_TEXT];

export type ContextType = {
  state: Record<string, unknown>;
  request: IRequest;
  response: IResponse;
  exception: Exception | null;
  params: Record<string, ScalarType>;
  payload: Record<string, unknown>;
  queries: Record<string, ScalarType>;
  cookies: CookieMap | null;
  form: FormData | null;
  language: LanguageType;
  path: string;
  method: MethodType;
  header: IReadonlyHeader;
  ip: string;
  host: string;
  user?: IUser;
  // TODO: route
};

export type ValidationScopeType =
  | 'params'
  | 'payload'
  | 'queries'
  | 'env'
  | 'response';

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
  readonly userAgent: IUserAgent;
  readonly params: Record<string, ScalarType>;
  readonly payload: Record<string, unknown>;
  readonly queries: Record<string, ScalarType>;
  readonly cookies: CookieMap;
  readonly form: FormData | null;
  readonly ip: string;
  readonly host: string;
  readonly referer: string | null;
  readonly bearerToken: string | null;
  readonly language: LanguageType;
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
  getUserAgent: () => IUserAgent;
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

export interface IResponse {
  readonly header: IHeader;
  readonly cookies: CookieMap;
  json: (
    data: Record<string, unknown>,
    status?: StatusCodeType,
    charset?: CharsetType,
  ) => this;
  exception: (
    message: string,
    data?: Record<string, unknown> | null,
    status?: StatusCodeType,
  ) => this;
  notFound: (
    message: string,
    data?: Record<string, unknown> | null,
    status?: StatusCodeType,
  ) => this;
  redirect: (url: string | URL, status?: StatusCodeType) => Response;
  getData: () => Record<string, unknown> | ReadableStream | null;
  build: (request: IRequest) => Response;
  isSuccessful: () => boolean;
  isInformational: () => boolean;
  isRedirect: () => boolean;
  isClientError: () => boolean;
  isServerError: () => boolean;
  isError: () => boolean;
}

export interface IStorage {
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  putFile(key: string, localPath: string): Promise<number>;
  put(
    key: string,
    content:
      | string
      | ArrayBufferView
      | ArrayBuffer
      | SharedArrayBuffer
      | Request
      | Response
      | BunFile
      | S3File
      | Blob,
  ): Promise<number>;
  getAsJson(key: string): Promise<any>;
  getAsArrayBuffer(key: string): Promise<ArrayBuffer>;
  getAsStream(key: string): ReadableStream;
}

export type ControllerType = {
  new (
    ...args: any[]
  ): {
    action: (context: Readonly<ContextType>) => Promise<IResponse> | IResponse;
  };
};

export type ConfigType = {
  new (
    ...args: any[]
  ): {
    get: <T>(...args: any[]) => T;
  };
};

export type ServiceType = {
  new (
    ...args: any[]
  ): {
    execute: <T>(...args: any[]) => Promise<T> | T;
  };
};

export type DatabaseType = {
  new (
    ...args: any[]
  ): {
    open: <T>(...args: any[]) => Promise<T> | T;
    close: <T>(...args: any[]) => Promise<T> | T;
  };
};

export type MailerType = {
  new (
    ...args: any[]
  ): {
    send: <T>(...args: any[]) => Promise<T> | T;
  };
};

export type MiddlewareType = {
  new (
    ...args: any[]
  ): {
    next: (
      context: ContextType,
    ) => Promise<ContextType | IResponse> | ContextType | IResponse;
  };
};

export type ValidatorType = {
  new (
    ...args: any[]
  ): {
    beforeValidation?: <T = any>(data: T) => Promise<any> | any;
  };
};

export type RoleType = {
  new (
    ...args: any[]
  ): {
    getRoles: () => Promise<string[]> | string[];
  };
};

export interface IUser {
  getId: () => Promise<string> | string;
  getUsername: () => Promise<string> | string;
  getRoles: () => Promise<string[]> | string[];
}

export interface IRouter {
  getRoutes: () => Map<string, RouteConfigType[]>;
}

export interface ILogger {
  onRequest: (context: ContextType) => Promise<void> | void;
  onResponse: (context: ContextType) => Promise<void> | void;
  onNotFound: (context: ContextType) => Promise<void> | void;
  onError: (context: ContextType) => Promise<void> | void;
}

export type UserAgentType = {
  browser: {
    name?: string;
    version?: string;
    major?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  device: {
    vendor?: string;
    model?: string;
    type?: string;
  };
  cpu: {
    architecture?: string;
  };
};

export type UserAgentBrowserType = UserAgentType['browser'];
export type UserAgentEngineType = UserAgentType['engine'];
export type UserAgentOsType = UserAgentType['os'];
export type UserAgentDeviceType = UserAgentType['device'];
export type UserAgentCpuType = UserAgentType['cpu'];

export interface IUserAgent {
  readonly browser: UserAgentBrowserType;
  readonly engine: UserAgentEngineType;
  readonly os: UserAgentOsType;
  readonly device: UserAgentDeviceType;
  readonly cpu: UserAgentCpuType;
}

export type ValidationResultType = {
  success: boolean;
  details: {
    property: string;
    value: string;
    constraints: { name: string; message: string }[];
  }[];
};
