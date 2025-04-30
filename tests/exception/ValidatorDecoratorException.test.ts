import { describe, expect, it } from 'bun:test';
import { ValidatorDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('ValidatorDecoratorException', () => {
  it('should create ValidatorDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new ValidatorDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(ValidatorDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create ValidatorDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new ValidatorDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw ValidatorDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new ValidatorDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(ValidatorDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
