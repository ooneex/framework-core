import { describe, expect, it } from 'bun:test';
import { Url } from '@';

describe('Url', () => {
  it('should parse a basic URL correctly', () => {
    const url = new Url('https://example.com/path?query=value#fragment');

    expect(url.protocol).toBe('https');
    expect(url.domain).toBe('example.com');
    expect(url.subdomain).toBe(null);
    expect(url.path).toBe('/path');
    expect(url.queries.query).toBe('value');
    expect(url.fragment).toBe('fragment');
    expect(url.port).toBe(80);
    expect(url.base).toBe('https://example.com');
    expect(url.origin).toBe('https://example.com');
  });

  it('should parse subdomain correctly', () => {
    const url = new Url('https://blog.example.com');

    expect(url.subdomain).toBe('blog');
    expect(url.domain).toBe('example.com');
  });

  it('should parse multiple subdomains correctly', () => {
    const url = new Url('https://dev.blog.example.com');

    expect(url.subdomain).toBe('dev.blog');
    expect(url.domain).toBe('example.com');
  });

  it('should parse custom port correctly', () => {
    const url = new Url('http://localhost:3000');

    expect(url.port).toBe(3000);
    expect(url.domain).toBe('localhost');
  });

  it('should parse multiple query parameters correctly', () => {
    const url = new Url('https://example.com?name=john&age=25&active=true');

    expect(url.queries.name).toBe('john');
    expect(url.queries.age).toBe(25);
    expect(url.queries.active).toBe(true);
  });

  it('should accept URL object as input', () => {
    const nativeUrl = new URL('https://example.com/test');
    const url = new Url(nativeUrl);

    expect(url.domain).toBe('example.com');
    expect(url.path).toBe('/test');
  });

  it('should handle URLs without path, query or fragment', () => {
    const url = new Url('https://example.com');

    expect(url.path).toBe('/');
    expect(url.queries).toEqual({});
    expect(url.fragment).toBe('');
  });
});
