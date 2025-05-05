import { describe, expect, it } from 'bun:test';
import { Validation } from '@';

describe('Validation', () => {
  it('should export function', () => {
    expect(Validation.validate).toBeFunction();
    expect(Validation.validateSync).toBeFunction();
    expect(Validation.validateOrReject).toBeFunction();
  });
  it('should export decorators', () => {
    expect(Validation.decorator.constraint).toBeFunction();
    expect(Validation.decorator.register).toBeFunction();
  });
});
