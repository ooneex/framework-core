import { describe, expect, it } from 'bun:test';
import { Jwt, type JwtExpiresInType } from '@';

describe('Jwt', () => {
  const secret = 'test-secret';
  const testPayload = {
    data: { userId: '123' },
    payload: {
      sub: 'user123',
      iss: 'test-issuer',
      aud: 'test-audience',
      exp: '1h' as JwtExpiresInType,
    },
  };

  it('should create a valid JWT token', async () => {
    const jwt = new Jwt(secret);
    const token = await jwt.create(testPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(await jwt.isValid(token)).toBe(true);
  });

  it('should return false for invalid token', async () => {
    const jwt = new Jwt(secret);
    expect(await jwt.isValid('invalid.token.here')).toBe(false);
    expect(await jwt.isValid()).toBe(false);
  });

  it('should correctly get token header', async () => {
    const jwt = new Jwt(secret);
    const token = await jwt.create(testPayload);
    const header = jwt.getHeader(token);
    expect(header).toHaveProperty('alg', 'HS256');
  });

  it('should correctly get token payload', async () => {
    const jwt = new Jwt(secret);
    const token = await jwt.create(testPayload);
    const payload = jwt.getPayload(token);
    expect(payload).toHaveProperty('sub', 'user123');
    expect(payload).toHaveProperty('iss', 'test-issuer');
    expect(payload).toHaveProperty('aud', 'test-audience');
    expect(payload).toHaveProperty('userId', '123');
  });

  it('should return correct secret', () => {
    const jwt = new Jwt(secret);
    expect(jwt.getSecret()).toBe(secret);
  });

  it('should work with token provided in constructor', async () => {
    const jwt1 = new Jwt(secret);
    const token = await jwt1.create(testPayload);

    const jwt2 = new Jwt(secret, token);
    expect(await jwt2.isValid()).toBe(true);
    expect(jwt2.getPayload()).toHaveProperty('userId', '123');
  });
});
