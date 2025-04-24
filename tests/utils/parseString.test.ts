import { describe, expect, it } from 'bun:test';
import { parseString } from '@';

describe('parseString', () => {
  it('should parse integers', () => {
    expect(parseString('123') as number).toBe(123);
    expect(parseString('0') as number).toBe(0);
    expect(parseString('-123') as number).toBe(-123);
  });

  it('should parse floating point numbers', () => {
    expect(parseString('123.45') as number).toBe(123.45);
    expect(parseString('123,45') as string).toBe('123,45');
    expect(parseString('-123.45') as number).toBe(-123.45);
  });

  it('should parse boolean values', () => {
    expect(parseString('true') as boolean).toBe(true);
    expect(parseString('TRUE') as boolean).toBe(true);
    expect(parseString('false') as boolean).toBe(false);
    expect(parseString('FALSE') as boolean).toBe(false);
  });

  it('should parse null', () => {
    expect(parseString('null') as null).toBe(null);
    expect(parseString('NULL') as null).toBe(null);
  });

  it('should parse arrays', () => {
    expect(parseString('[1, 2, 3]') as number[]).toEqual([1, 2, 3]);
    expect(parseString('[true, false]') as boolean[]).toEqual([true, false]);
    expect(parseString('[1.5, 2.5]') as number[]).toEqual([1.5, 2.5]);
    expect(parseString('["a", "b"]') as string[]).toEqual(['a', 'b']);
  });

  it('should parse JSON objects', () => {
    expect(parseString('{"a": 1}') as Record<string, number>).toEqual({
      a: 1,
    });
    expect(parseString('{"b": true}') as Record<string, boolean>).toEqual({
      b: true,
    });
  });

  it('should return original string if parsing fails', () => {
    expect(parseString('hello') as string).toBe('hello');
    expect(parseString('123abc') as string).toBe('123abc');
  });

  it('should handle generic type parameter', () => {
    const result = parseString<number[]>('[1, 2, 3]');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should ignore Infinity', () => {
    expect(parseString<string>('40290809e923969')).toBe('40290809e923969');
    expect(parseString<string>('-40290809e923969')).toBe('-40290809e923969');
  });
});
