import { describe, expect, it } from 'bun:test';
import { container, parseEnvVars } from '@';

describe('Environment Variables', () => {
  it('parseEnvVars', () => {
    Bun.env.PORT = '9000';
    Bun.env.DB_URL = 'sqlite://';

    const vars = parseEnvVars<{ port: number; dbUrl: string }>();
    expect(vars.port).toBe(9000);
    expect(vars.dbUrl).toBe('sqlite://');

    expect(container.get<number>('env.port')).toBe(9000);
    expect(container.get<string>('env.dbUrl')).toBe('sqlite://');
  });
});
