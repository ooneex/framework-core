import { describe, expect, it } from 'bun:test';
import { ValidationException } from '@';
import { STATUS_CODE } from '@';

describe('ValidationException', () => {
  it('should create ValidationException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new ValidationException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(ValidationException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.BadRequest);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create ValidationException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new ValidationException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw ValidationException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new ValidationException(errorMessage);
    };

    expect(throwableFunction).toThrow(ValidationException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
