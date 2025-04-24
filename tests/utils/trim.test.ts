import { describe, expect, it } from 'bun:test';
import { trim } from '@';

describe('trim', () => {
  it('should trim spaces from both ends by default', () => {
    expect(trim('  hello  ')).toBe('hello');
    expect(trim('hello  ')).toBe('hello');
    expect(trim('  hello')).toBe('hello');
    expect(trim('hello')).toBe('hello');
  });

  it('should trim specified character from both ends', () => {
    expect(trim('###hello###', '#')).toBe('hello');
    expect(trim('...test...', '.')).toBe('test');
    expect(trim('__world__', '_')).toBe('world');
  });

  it('should handle empty strings', () => {
    expect(trim('')).toBe('');
    expect(trim('   ')).toBe('');
    expect(trim('###', '#')).toBe('');
  });

  it('should handle strings with mixed characters', () => {
    expect(trim('#hello world#', '#')).toBe('hello world');
    expect(trim('  hello#world  ')).toBe('hello#world');
  });

  it('should handle special regex characters', () => {
    const specialChars = [
      '.',
      '[',
      ']',
      '(',
      ')',
      '+',
      '*',
      '^',
      '$',
      '?',
      '/',
    ];

    for (const char of specialChars) {
      const testString = `${char}${char}hello${char}${char}`;
      expect(trim(testString, char)).toBe('hello');
    }
  });
});
