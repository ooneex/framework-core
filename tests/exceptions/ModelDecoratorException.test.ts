import { describe, expect, it } from 'bun:test';
import { ModelDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('ModelDecoratorException', () => {
  it('should create ModelDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new ModelDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(ModelDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create ModelDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new ModelDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw ModelDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new ModelDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(ModelDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
