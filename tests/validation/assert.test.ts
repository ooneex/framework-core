import { describe, expect, it } from 'bun:test';
import { Assert } from '@';

describe('Validation', () => {
  it('should export asserts', () => {
    expect(Assert).toBeObject();
    expect(Object.keys(Assert)).toBeArrayOfSize(108);
  });
});
