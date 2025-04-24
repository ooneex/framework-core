import { describe, expect, it } from 'bun:test';
import { HeaderChecker } from '@';

class TestHeaderChecker extends HeaderChecker {}

describe('HeaderChecker', () => {
  describe('isJson', () => {
    it('should return true for application/json', () => {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isJson()).toBe(true);
    });

    it('should return true for application/ld+json', () => {
      const headers = new Headers({ 'Content-Type': 'application/ld+json' });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isJson()).toBe(true);
    });

    it('should return false when Content-Type is missing', () => {
      const headers = new Headers();
      const checker = new TestHeaderChecker(headers);
      expect(checker.isJson()).toBe(false);
    });
  });

  describe('isFormData', () => {
    it('should return true for multipart/form-data', () => {
      const headers = new Headers({ 'Content-Type': 'multipart/form-data' });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isFormData()).toBe(true);
    });

    it('should return false when Content-Type is missing', () => {
      const headers = new Headers();
      const checker = new TestHeaderChecker(headers);
      expect(checker.isFormData()).toBe(false);
    });
  });

  describe('isForm', () => {
    it('should return true for application/x-www-form-urlencoded', () => {
      const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isForm()).toBe(true);
    });

    it('should return false when Content-Type is missing', () => {
      const headers = new Headers();
      const checker = new TestHeaderChecker(headers);
      expect(checker.isForm()).toBe(false);
    });
  });

  describe('isText', () => {
    it('should return true for various text content types', () => {
      const textTypes = [
        'text/css',
        'text/*',
        'text/csv',
        'text/html',
        'text/plain',
        'text/xml',
      ];

      textTypes.map((type) => {
        const headers = new Headers({ 'Content-Type': type });
        const checker = new TestHeaderChecker(headers);
        expect(checker.isText()).toBe(true);
      });
    });

    it('should return false when Content-Type is missing', () => {
      const headers = new Headers();
      const checker = new TestHeaderChecker(headers);
      expect(checker.isText()).toBe(false);
    });
  });

  describe('isStream', () => {
    it('should return true for application/octet-stream', () => {
      const headers = new Headers({
        'Content-Type': 'application/octet-stream',
      });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isStream()).toBe(true);
    });

    it('should return false when Content-Type is missing', () => {
      const headers = new Headers();
      const checker = new TestHeaderChecker(headers);
      expect(checker.isStream()).toBe(false);
    });
  });

  describe('isBlob', () => {
    it('should return same result as isStream', () => {
      const headers = new Headers({
        'Content-Type': 'application/octet-stream',
      });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isBlob()).toBe(checker.isStream());
    });
  });

  describe('isHtml', () => {
    it('should return true for text/html', () => {
      const headers = new Headers({ 'Content-Type': 'text/html' });
      const checker = new TestHeaderChecker(headers);
      expect(checker.isHtml()).toBe(true);
    });

    it('should return false when Content-Type is missing', () => {
      const headers = new Headers();
      const checker = new TestHeaderChecker(headers);
      expect(checker.isHtml()).toBe(false);
    });
  });
});
