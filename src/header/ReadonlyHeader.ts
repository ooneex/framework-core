import { UAParser } from 'ua-parser-js';
import type {
  CharsetType,
  EncodingType,
  HeaderFieldType,
  IReadonlyHeader,
  IUserAgent,
  MethodType,
  MimeType,
} from '../types';
import { HeaderChecker } from './HeaderChecker';

type MimeReturnType = MimeType | '*/*' | null;

export class ReadonlyHeader extends HeaderChecker implements IReadonlyHeader {
  constructor(public readonly native: Headers) {
    super(native);
  }

  public get(name: HeaderFieldType): string | null {
    return this.native.get(name);
  }

  public getCharset(): CharsetType | null {
    const contentType = this.getContentType();

    if (!contentType) {
      return null;
    }

    const match = contentType
      .toString()
      .match(/charset *= *(?<charset>[a-z0-9-]+)/i);

    if (!match) {
      return null;
    }

    return match[1].toUpperCase() as CharsetType | null;
  }

  public getCacheControl(): string | null {
    return this.get('Cache-Control');
  }

  public getEtag(): string | null {
    return this.get('Etag');
  }

  public getAccept(): MimeReturnType {
    return (this.get('Accept') ?? null) as MimeReturnType;
  }

  public getAcceptEncoding(): EncodingType[] | null {
    const encoding = this.get('Accept-Encoding');

    if (!encoding) {
      return null;
    }

    return encoding.split(',').map((val) => {
      return val.trim();
    }) as EncodingType[] | null;
  }

  public getAllow(): MethodType[] | null {
    const allow = this.get('Allow');
    if (!allow) {
      return null;
    }

    return allow.split(',').map((method) => method.trim()) as MethodType[];
  }

  public getContentLength(): number | null {
    const length = this.get('Content-Length');

    if (!length) {
      return null;
    }

    return Number.parseInt(length);
  }

  public getContentType(): MimeReturnType {
    return this.get('Content-Type') as MimeReturnType;
  }

  public getContentDisposition(): string | null {
    return this.get('Content-Disposition');
  }

  public getHost(): string {
    return this.get('Host') as string;
  }

  public getIp(): string {
    return (this.get('X-Forwarded-For') || this.get('Remote-Addr')) as string;
  }

  public getReferer(): string | null {
    return this.get('Referer');
  }

  public getRefererPolicy(): string | null {
    return this.get('Referrer-Policy');
  }

  public getUserAgent(): IUserAgent {
    return UAParser(this.get('User-Agent') as string);
  }

  public getAuthorization(): string | null {
    return this.get('Authorization');
  }

  public getBasicAuth(): string | null {
    const auth = this.get('Authorization');

    if (!auth) {
      return null;
    }

    const match = auth.match(/Basic +(?<auth>[^, ]+)/);

    if (!match) {
      return null;
    }

    return match[1];
  }

  public getBearerToken(): string | null {
    const token = this.get('Authorization');

    if (!token) {
      return null;
    }

    const match = token.match(/Bearer +(?<token>[^, ]+)/);

    if (!match) {
      return null;
    }

    return match[1];
  }

  public has(name: HeaderFieldType): boolean {
    return this.native.has(name);
  }

  public toJson(): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const [key, value] of this) {
      headers[key] = value;
    }

    return headers;
  }

  [Symbol.iterator](): IterableIterator<[HeaderFieldType, any]> {
    // @ts-ignore: trust me
    return this.native[Symbol.iterator]();
  }
}
