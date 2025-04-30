import { describe, expect, it } from 'bun:test';
import { RoleDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('RoleDecoratorException', () => {
  it('should create RoleDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new RoleDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(RoleDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create RoleDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new RoleDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw RoleDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new RoleDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(RoleDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
