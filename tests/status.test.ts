import { describe, expect, it } from 'bun:test';
import {
  isClientErrorStatus,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isStatus,
  isSuccessfulStatus,
} from '@';

describe('http status', () => {
  describe('isStatus', () => {
    it('should return true for valid status codes', () => {
      const validStatus = [100, 200, 400, 500];

      for (const code of validStatus) {
        it(`${code}`, () => {
          expect(isStatus(code)).toBe(true);
        });
      }
    });

    it('should return false for invalid status codes', () => {
      const invalidStatus = [99, 520, 600];

      for (const code of invalidStatus) {
        it(`${code}`, () => {
          expect(isStatus(code)).toBe(false);
        });
      }
    });
  });

  describe('isInformationalStatus', () => {
    const validStatus = [100, 101, 102, 103];

    for (const code of validStatus) {
      it(`${code}`, () => {
        expect(isInformationalStatus(code)).toBe(true);
      });
    }

    const invalidStatus = [200, 400, 500];
    for (const code of invalidStatus) {
      it(`${code}`, () => {
        expect(isInformationalStatus(code)).toBe(false);
      });
    }
  });

  describe('isSuccessfulStatus', () => {
    const validStatus = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];

    for (const code of validStatus) {
      it(`${code}`, () => {
        expect(isSuccessfulStatus(code)).toBe(true);
      });
    }

    const invalidStatus = [100, 400, 500];
    for (const code of invalidStatus) {
      it(`${code}`, () => {
        expect(isSuccessfulStatus(code)).toBe(false);
      });
    }
  });

  describe('isRedirectionStatus', () => {
    const validStatus = [300, 301, 302, 303, 304, 305, 307, 308];

    for (const code of validStatus) {
      it(`${code}`, () => {
        expect(isRedirectStatus(code)).toBe(true);
      });
    }

    const invalidStatus = [100, 200, 400, 500];
    for (const code of invalidStatus) {
      it(`${code}`, () => {
        expect(isRedirectStatus(code)).toBe(false);
      });
    }
  });

  describe('isClientErrorStatus', () => {
    const validStatus = [
      400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
      415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
    ];

    for (const code of validStatus) {
      it(`${code}`, () => {
        expect(isClientErrorStatus(code)).toBe(true);
      });
    }

    const invalidStatus = [100, 200, 300, 500];
    for (const code of invalidStatus) {
      it(`${code}`, () => {
        expect(isClientErrorStatus(code)).toBe(false);
      });
    }
  });

  describe('isServerErrorStatus', () => {
    const validStatus = [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511];

    for (const code of validStatus) {
      it(`${code}`, () => {
        expect(isServerErrorStatus(code)).toBe(true);
      });
    }

    const invalidStatus = [100, 200, 300, 400];
    for (const code of invalidStatus) {
      it(`${code}`, () => {
        expect(isServerErrorStatus(code)).toBe(false);
      });
    }
  });

  describe('isErrorStatus', () => {
    const validStatus = [400, 500];

    for (const code of validStatus) {
      it(`${code}`, () => {
        expect(isErrorStatus(code)).toBe(true);
      });
    }

    const invalidStatus = [100, 200, 300];
    for (const code of invalidStatus) {
      it(`${code}`, () => {
        expect(isErrorStatus(code)).toBe(false);
      });
    }
  });
});
