import { describe, expect, it } from 'bun:test';
import { RepositoryDecoratorException } from '@';
import { STATUS_CODE } from '@';

describe('RepositoryDecoratorException', () => {
  it('should create RepositoryDecoratorException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new RepositoryDecoratorException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(RepositoryDecoratorException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.InternalServerError);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create RepositoryDecoratorException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new RepositoryDecoratorException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw RepositoryDecoratorException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new RepositoryDecoratorException(errorMessage);
    };

    expect(throwableFunction).toThrow(RepositoryDecoratorException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
