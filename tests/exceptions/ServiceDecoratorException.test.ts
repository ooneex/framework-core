import { describe, expect, it } from 'bun:test';
import { ServiceDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('ServiceDecoratorException', () => {
  it('should create ServiceDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new ServiceDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(ServiceDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create ServiceDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new ServiceDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw ServiceDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new ServiceDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(ServiceDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
