import { parseString, toCamelCase } from '@';
import type { ScalarType } from './types';

export const parseEnvVars = <T = Record<string, ScalarType>>(): T => {
  const vars: Record<string, ScalarType> = {};

  for (const key in Bun.env) {
    vars[toCamelCase(key)] = parseString(Bun.env[key] as string);
  }

  return vars as T;
};
