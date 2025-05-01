import { describe, expect, it } from 'bun:test';
import { DatabaseDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('DatabaseDecoratorException', () => {
  it('should create DatabaseDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new DatabaseDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(DatabaseDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create DatabaseDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new DatabaseDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw DatabaseDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new DatabaseDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(DatabaseDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
