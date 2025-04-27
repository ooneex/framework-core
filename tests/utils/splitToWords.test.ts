import { describe, expect, it } from 'bun:test';
import { splitToWords } from '@';

describe('splitToWords', () => {
  it('handles an empty string', () => {
    expect(splitToWords('')).toEqual([]);
  });

  it('splits a simple sentence', () => {
    const input = 'hello world';
    const expected = ['hello', 'world'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles camelCase', () => {
    const input = 'helloWorld';
    const expected = ['hello', 'World'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles PascalCase', () => {
    const input = 'HelloWorld';
    const expected = ['Hello', 'World'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles snake_case', () => {
    const input = 'hello_world';
    const expected = ['hello', 'world'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles kebab-case', () => {
    const input = 'hello-world';
    const expected = ['hello', 'world'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles acronyms', () => {
    const input = 'HTMLElement';
    const expected = ['HTML', 'Element'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles numbers', () => {
    const input = 'version2.0';
    const expected = ['version', '2', '0'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles special characters', () => {
    const input = 'hello!world';
    const expected = ['hello', 'world'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles non-English characters', () => {
    const input = 'caféAuLait';
    const expected = ['café', 'Au', 'Lait'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });

  it('handles multiple delimiters', () => {
    const input = 'hello-world_foo bar';
    const expected = ['hello', 'world', 'foo', 'bar'];
    expect(splitToWords(input) as string[]).toEqual(expected);
  });
});