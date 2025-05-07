import type { JWTHeaderParameters } from 'jose';
import * as jose from 'jose';
import type { IJwt, JwtDefaultPayloadType, JwtPayloadType } from './types';

export class Jwt implements IJwt {
  private secret: string;
  private token: string | null = null;

  constructor(secret: string, token: string | null = null) {
    this.secret = secret;
    this.token = token;
  }

  public async create(config?: {
    payload?: JwtDefaultPayloadType;
    data?: Record<string, unknown>;
    header?: JWTHeaderParameters;
  }): Promise<string> {
    const alg = 'HS256';
    const payload = config?.payload ?? {};

    const token = new jose.SignJWT({
      ...(config?.data ?? {}),
    }).setProtectedHeader({ ...{ alg }, ...(config?.header ?? {}) });

    if (payload.iss) {
      token.setIssuer(payload.iss);
    }

    if (payload.sub) {
      token.setSubject(payload.sub);
    }

    if (payload.aud) {
      token.setAudience(payload.aud);
    }

    if (payload.exp) {
      token.setExpirationTime(payload.exp ?? '1h');
    }

    if (payload.iat) {
      token.setIssuedAt(payload.iat);
    }

    if (payload.nbf) {
      token.setNotBefore(payload.nbf);
    }

    if (payload.jti) {
      token.setJti(payload.jti);
    }

    return await token.sign(new TextEncoder().encode(this.secret));
  }

  public getSecret(): string {
    return this.secret;
  }

  public async isValid(token?: string): Promise<boolean> {
    const secret = this.secret;

    if (!token && !this.token) {
      return false;
    }

    try {
      await jose.jwtVerify(
        token ?? (this.token as string),
        new TextEncoder().encode(secret),
      );

      return true;
    } catch (_error) {
      return false;
    }
  }

  public getHeader<T = JWTHeaderParameters>(token?: string): T {
    return jose.decodeProtectedHeader(token ?? (this.token as string)) as T;
  }

  public getPayload<T = JwtPayloadType>(token?: string): T {
    return jose.decodeJwt(token ?? (this.token as string)) as T;
  }
}
