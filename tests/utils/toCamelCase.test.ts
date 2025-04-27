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
    const result = toCamelCase(' bun Is AWESOME ');
    const expected = 'bunIsAwesome';
    expect(result).toBe(expected);
  });

  it('handles strings with numbers', () => {
    const result = toCamelCase('version 2.0 release');
    const expected = 'version20Release';
    expect(result).toBe(expected);
  });

  it('handles strings with only special characters', () => {
    const result = toCamelCase('!@#$%^&*()');
    const expected = '';
    expect(result).toBe(expected);
  });

  it('handles strings with non-English characters', () => {
    const result = toCamelCase('café au lait');
    const expected = 'caféAuLait';
    expect(result).toBe(expected);
  });
});
