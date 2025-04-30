import { container } from '../container';
import type { ScalarType } from '../types';
import { parseString } from './parseString';
import { toCamelCase } from './toCamelCase';

export const parseEnvVars = <T = Record<string, ScalarType>>(): T => {
  const vars: Record<string, ScalarType> = {};

  for (const key in Bun.env) {
    const k = toCamelCase(key);
    const value = parseString(Bun.env[key] as string) as ScalarType;
    container.bind(`env.${k}`).toConstantValue(value);
    vars[k] = value;
  }

  return vars as T;
};
