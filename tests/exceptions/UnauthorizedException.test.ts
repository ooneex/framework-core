import { describe, expect, it } from 'bun:test';
import { UnauthorizedException } from '@';
import { STATUS_CODE } from '@';

describe('UnauthorizedException', () => {
  it('should create UnauthorizedException with string message', () => {
    const errorMessage = 'Test error message';

    try {
      throw new UnauthorizedException(errorMessage);
    } catch (exception: any) {
      expect(exception).toBeInstanceOf(UnauthorizedException);
      expect(exception.message).toBe(errorMessage);
      expect(exception.status).toBe(STATUS_CODE.Unauthorized);
      expect(exception.data).toBeNull();
      expect(exception.date).toBeInstanceOf(Date);
    }
  });

  it('should create UnauthorizedException with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };

    try {
      throw new UnauthorizedException(errorMessage, data);
    } catch (exception: any) {
      expect(exception.data).toEqual(data);
    }
  });

  it('should throw UnauthorizedException', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new UnauthorizedException(errorMessage);
    };

    expect(throwableFunction).toThrow(UnauthorizedException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
