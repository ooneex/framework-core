import { describe, expect, it } from 'bun:test';
import { NotFoundException } from '@';
import { STATUS_CODE } from '@';

describe('NotFoundException', () => {
  it('should create NotFoundException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new NotFoundException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(NotFoundException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.NotFound);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create NotFoundException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new NotFoundException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw NotFoundException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new NotFoundException(errorMessage);
    };

    expect(throwableFunction).toThrow(NotFoundException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
