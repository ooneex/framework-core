import { describe, expect, it } from 'bun:test';
import { BadRequestException } from '@';
import { STATUS_CODE } from '@';

describe('BadRequestException', () => {
  it('should create BadRequestException with string message', () => {
    const errorMessage = 'Test error message';
    const exception = new BadRequestException(errorMessage);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.BadRequest);
    expect(exception.data).toBeNull();
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create BadRequestException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };
    const exception = new BadRequestException(errorMessage, data);

    expect(exception.data).toEqual(data);
  });

  it('should throw BadRequestException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new BadRequestException(errorMessage);
    };

    expect(throwableFunction).toThrow(BadRequestException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
