import { describe, expect, it } from 'bun:test';
import { MiddlewareDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('MiddlewareDecoratorException', () => {
  it('should create MiddlewareDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new MiddlewareDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(MiddlewareDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create MiddlewareDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new MiddlewareDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw MiddlewareDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new MiddlewareDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(MiddlewareDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
