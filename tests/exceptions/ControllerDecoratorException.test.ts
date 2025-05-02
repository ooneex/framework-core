import { describe, expect, it } from 'bun:test';
import { ControllerDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('ControllerDecoratorException', () => {
  it('should create ControllerDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new ControllerDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(ControllerDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create ControllerDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new ControllerDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw ControllerDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new ControllerDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(ControllerDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
