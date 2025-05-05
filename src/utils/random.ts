import { customAlphabet } from 'nanoid';

export const random = {
  uuid(): string {
    return crypto.randomUUID();
  },

  nanoid(size?: number): string {
    return customAlphabet('1234567890abcdef', size ?? 10)();
  },
  stringInt(size?: number): string {
    return customAlphabet('1234567890', size ?? 10)();
  },
  nanoidFactory(size?: number): (size?: number) => string {
    return customAlphabet('1234567890abcdef', size ?? 10);
  },
};
