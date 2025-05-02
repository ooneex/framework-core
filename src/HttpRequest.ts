import parser from 'accept-language-parser';
import { type BunRequest, CookieMap, type RouterTypes } from 'bun';
import { Url } from './Url';
import { ReadonlyHeader } from './header/ReadonlyHeader';
import type {
  IReadonlyHeader,
  IRequest,
  IUrl,
  IUserAgent,
  LanguageType,
  LocaleType,
  MethodType,
  ScalarType,
} from './types';
import { parseString } from './utils/parseString';

export class HttpRequest implements IRequest {
  public readonly path: string;
  public readonly url: IUrl;
  public readonly method: MethodType;
  public readonly header: IReadonlyHeader;
  public readonly userAgent: IUserAgent;
  public readonly params: Record<string, ScalarType> = {};
  public readonly payload: Record<string, unknown> = {};
  public readonly queries: Record<string, ScalarType> = {};
  public readonly cookies: CookieMap;
  public readonly form: FormData | null;
  public readonly ip: string;
  public readonly host: string;
  public readonly referer: string | null;
  public readonly bearerToken: string | null;
  public readonly language: LanguageType;

  constructor(
    public readonly native: Readonly<BunRequest>,
    config: {
      form?: FormData | null;
      payload?: Record<string, unknown>;
      ip: string;
    },
  ) {
    this.url = new Url(this.native.url);
    this.path = this.url.path;
    this.method = this.native.method.toUpperCase() as MethodType;
    this.header = new ReadonlyHeader(native.headers);
    this.queries = this.url.queries;
    this.payload = config?.payload ?? {};
    this.form = config?.form ?? null;
    this.cookies = this.native.cookies ?? new CookieMap();
    this.userAgent = this.header.getUserAgent();

    const params = this.native.params;
    for (const key in params) {
      this.params[key] = parseString(
        `${params[key as keyof RouterTypes.ExtractRouteParams<unknown>]}`,
      );
    }

    this.ip = config.ip;
    this.host = this.header.getHost();
    this.referer = this.header.getReferer();
    this.bearerToken = this.header.getBearerToken();

    const customLang = this.header.get('X-Custom-Lang');
    if (customLang) {
      this.language = {
        code: customLang as LocaleType,
        region: null,
      };
    } else {
      const languages = parser.parse(
        this.header.get('Accept-Language') ?? 'en-US',
      );
      const language = languages[0];
      this.language = {
        code: language.code as LocaleType,
        region: language.region ?? null,
      };
    }
  }
}
