import { describe, expect, it } from 'bun:test';
import {capitalizeWord} from "@";

describe('capitalizeWord', () => {
  it('handles an empty string', () => {
    expect(capitalizeWord('')).toBe('');
  });

  it('capitalizes a lowercase word', () => {
    const input = 'hello';
    const expected = 'Hello';
    expect(capitalizeWord(input)).toBe(expected);
  });

  it('normalizes an uppercase word', () => {
    const input = 'WORLD';
    const expected = 'World';
    expect(capitalizeWord(input)).toBe(expected);
  });

  it('normalizes a mixed case word', () => {
    const input = 'jAvAsCrIpT';
    const expected = 'Javascript';
    expect(capitalizeWord(input)).toBe(expected);
  });

  it('handles a single character', () => {
    const input = 'a';
    const expected = 'A';
    expect(capitalizeWord(input)).toBe(expected);
  });

  it('handles a word with numbers', () => {
    const input = 'version2';
    const expected = 'Version2';
    expect(capitalizeWord(input)).toBe(expected);
  });

  it('handles a word with special characters', () => {
    const input = 'hello!';
    const expected = 'Hello!';
    expect(capitalizeWord(input)).toBe(expected);
  });

  it('handles a word with non-English characters', () => {
    const input = 'café';
    const expected = 'Café';
    expect(capitalizeWord(input)).toBe(expected);
  });
});