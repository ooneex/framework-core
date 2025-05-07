import { describe, expect, it } from 'bun:test';
import { StorageDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('StorageDecoratorException', () => {
  it('should create StorageDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new StorageDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(StorageDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create StorageDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new StorageDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw StorageDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new StorageDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(StorageDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
