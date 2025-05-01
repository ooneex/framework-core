import { describe, expect, it } from 'bun:test';
import { ConfigDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('ConfigDecoratorException', () => {
  it('should create ConfigDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new ConfigDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(ConfigDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create ConfigDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new ConfigDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw ConfigDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new ConfigDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(ConfigDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
