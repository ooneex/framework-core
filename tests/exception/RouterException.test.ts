import { describe, expect, it } from 'bun:test';
import { RouterException } from '@';
import { STATUS_CODE } from '@';

describe('RouterException', () => {
  it('should create RouterException with string message', () => {
    const errorMessage = 'Test error message';
    const exception = new RouterException(errorMessage);

    expect(exception).toBeInstanceOf(RouterException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create RouterException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };
    const exception = new RouterException(errorMessage, data);

    expect(exception.data).toEqual(data);
  });

  it('should throw RouterException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new RouterException(errorMessage);
    };

    expect(throwableFunction).toThrow(RouterException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
