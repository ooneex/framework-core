import { describe, expect, it } from 'bun:test';
import { toCamelCase } from '@';

describe('toCamelCase', () => {
  it('handles an empty string', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('converts a single word', () => {
    const input = 'shruberry';
    const expected = 'shruberry';
    expect(toCamelCase(input)).toBe(expected);
  });

  it('converts a sentence', () => {
    const input = 'she turned me into a newt';
    const expected = 'sheTurnedMeIntoANewt';
    expect(toCamelCase(input)).toBe(expected);
  });

  it('converts multiple delimiters', () => {
    const result = toCamelCase('I am up-to-date!');
    const expected = 'iAmUpToDate';
    expect(result).toBe(expected);
  });

  it('trims whitespace', () => {
    const result = toCamelCase(' deno Is AWESOME ');
    const expected = 'denoIsAwesome';
    expect(result).toBe(expected);
  });
});
