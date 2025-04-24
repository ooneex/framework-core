import { describe, expect, it } from 'bun:test';
import { MethodNotAllowedException } from '@';
import { STATUS_CODE } from '@';

describe('MethodNotAllowedException', () => {
  it('should create MethodNotAllowedException with string message', () => {
    const errorMessage = 'Test error message';
    const exception = new MethodNotAllowedException(errorMessage);

    expect(exception).toBeInstanceOf(MethodNotAllowedException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.MethodNotAllowed);
    expect(exception.data).toBeNull();
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create MethodNotAllowedException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };
    const exception = new MethodNotAllowedException(errorMessage, data);

    expect(exception.data).toEqual(data);
  });

  it('should throw MethodNotAllowedException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new MethodNotAllowedException(errorMessage);
    };

    expect(throwableFunction).toThrow(MethodNotAllowedException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
