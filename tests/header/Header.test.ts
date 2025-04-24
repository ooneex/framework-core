import { describe, expect, it } from 'bun:test';
import { Header } from '@';

describe('Header', () => {
  describe('constructor', () => {
    it('should create empty headers when no argument provided', () => {
      const headers = new Header();
      expect(headers).toBeDefined();
    });

    it('should accept existing Headers object', () => {
      const native = new Headers();
      const headers = new Header(native);
      expect(headers).toBeDefined();
    });
  });

  describe('authorization methods', () => {
    it('should set basic authorization header', () => {
      const headers = new Header();
      headers.setBasicAuth('test-token');
      expect(headers.get('Authorization')).toBe('Basic test-token');
    });

    it('should set bearer token', () => {
      const headers = new Header();
      headers.setBearerToken('test-token');
      expect(headers.get('Authorization')).toBe('Bearer test-token');
    });

    it('should set raw authorization header', () => {
      const headers = new Header();
      headers.setAuthorization('Custom auth');
      expect(headers.get('Authorization')).toBe('Custom auth');
    });
  });

  describe('content type methods', () => {
    it('should set JSON content type with charset', () => {
      const headers = new Header();
      headers.setJsonType('UTF-8');
      expect(headers.get('Content-Type')).toBe(
        'application/json; charset=UTF-8',
      );
      expect(headers.get('Accept')).toBe('application/json');
    });

    it('should set blob content type', () => {
      const headers = new Header();
      headers.setBlobType();
      expect(headers.get('Content-Type')).toBe(
        'application/octet-stream; charset=UTF-8',
      );
    });

    it('should set form data content type', () => {
      const headers = new Header();
      headers.setFormDataType();
      expect(headers.get('Content-Type')).toBe(
        'multipart/form-data; charset=UTF-8',
      );
    });

    it('should set HTML content type with charset', () => {
      const headers = new Header();
      headers.setHtmlType('UTF-8');
      expect(headers.get('Content-Type')).toBe('text/html; charset=UTF-8');
    });
  });

  describe('content headers', () => {
    it('should set content disposition', () => {
      const headers = new Header();
      headers.contentDisposition('attachment; filename="example.txt"');
      expect(headers.get('Content-Disposition')).toBe(
        'attachment; filename="example.txt"',
      );
    });

    it('should set content length', () => {
      const headers = new Header();
      headers.contentLength(1234);
      expect(headers.get('Content-Length')).toBe('1234');
    });
  });

  describe('header manipulation', () => {
    it('should add and get custom header', () => {
      const headers = new Header();
      headers.setCustom('test-value');
      expect(headers.get('X-Custom')).toBe('test-value');
    });

    it('should delete header', () => {
      const headers = new Header();
      headers.set('X-Custom-Test', 'value');
      headers.delete('X-Custom-Test');
      expect(headers.get('X-Custom-Test')).toBeNull();
    });

    it('should set cache control', () => {
      const headers = new Header();
      headers.setCacheControl('no-cache');
      expect(headers.get('Cache-Control')).toBe('no-cache');
    });

    it('should set etag', () => {
      const headers = new Header();
      headers.setEtag('123abc');
      expect(headers.get('Etag')).toBe('123abc');
    });
  });

  describe('header existence checks', () => {
    it('should check if header exists', () => {
      const headers = new Header();
      headers.set('X-Custom-Test', 'value');
      expect(headers.has('X-Custom-Test')).toBe(true);
      expect(headers.has('X-Custom-Non-Existent')).toBe(false);
    });

    it('should return all headers', () => {
      const headers = new Header();
      headers.set('X-Custom-Test-1', 'value1');
      headers.set('X-Custom-Test-2', 'value2');

      expect(headers.get('X-Custom-Test-1')).toBe('value1');
      expect(headers.get('X-Custom-Test-2')).toBe('value2');
    });
  });

  describe('content type handling', () => {
    it('should set JSON content type without charset', () => {
      const headers = new Header();
      headers.setJsonType();
      expect(headers.get('Content-Type')).toBe(
        'application/json; charset=UTF-8',
      );
    });

    it('should set text content type with charset', () => {
      const headers = new Header();
      headers.setTextType('UTF-16');
      expect(headers.get('Content-Type')).toBe('text/plain; charset=UTF-16');
    });
  });

  describe('authorization headers', () => {
    it('should set authorization header', () => {
      const headers = new Header();
      headers.setAuthorization('auth-value');
      expect(headers.get('Authorization')).toBe('auth-value');
    });

    it('should set basic auth', () => {
      const headers = new Header();
      headers.setBasicAuth('token123');
      expect(headers.get('Authorization')).toBe('Basic token123');
    });

    it('should set bearer token', () => {
      const headers = new Header();
      headers.setBearerToken('token123');
      expect(headers.get('Authorization')).toBe('Bearer token123');
    });
  });

  describe('content type setters', () => {
    it('should set blob content type', () => {
      const headers = new Header();
      headers.setBlobType();
      expect(headers.get('Content-Type')).toBe(
        'application/octet-stream; charset=UTF-8',
      );

      headers.setBlobType('UTF-16');
      expect(headers.get('Content-Type')).toBe(
        'application/octet-stream; charset=UTF-16',
      );
    });

    it('should set stream content type', () => {
      const headers = new Header();
      headers.setStreamType();
      expect(headers.get('Content-Type')).toBe(
        'application/octet-stream; charset=UTF-8',
      );
    });

    it('should set form data content type', () => {
      const headers = new Header();
      headers.setFormDataType();
      expect(headers.get('Content-Type')).toBe(
        'multipart/form-data; charset=UTF-8',
      );
    });

    it('should set form content type', () => {
      const headers = new Header();
      headers.setFormType();
      expect(headers.get('Content-Type')).toBe(
        'application/x-www-form-urlencoded; charset=UTF-8',
      );
    });

    it('should set HTML content type', () => {
      const headers = new Header();
      headers.setHtmlType();
      expect(headers.get('Content-Type')).toBe('text/html; charset=UTF-8');
    });
  });

  describe('content headers', () => {
    it('should set content disposition', () => {
      const headers = new Header();
      headers.contentDisposition('attachment; filename="test.txt"');
      expect(headers.get('Content-Disposition')).toBe(
        'attachment; filename="test.txt"',
      );
    });

    it('should set content length', () => {
      const headers = new Header();
      headers.contentLength(1024);
      expect(headers.get('Content-Length')).toBe('1024');
    });
  });

  describe('custom headers', () => {
    it('should set custom header', () => {
      const headers = new Header();
      headers.setCustom('custom-value');
      expect(headers.get('X-Custom')).toBe('custom-value');
    });
  });
});
