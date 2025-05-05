import { describe, expect, it } from 'bun:test';
import { toKebabCase } from '@';

describe('toKebabCase', () => {
  it('converts camelCase strings to kebab-case', () => {
    expect(toKebabCase('camelCaseString')).toBe('camel-case-string');
    expect(toKebabCase('userId')).toBe('user-id');
    expect(toKebabCase('getHTTPResponse')).toBe('get-http-response');
  });

  it('converts PascalCase strings to kebab-case', () => {
    expect(toKebabCase('PascalCaseString')).toBe('pascal-case-string');
    expect(toKebabCase('UserProfile')).toBe('user-profile');
    expect(toKebabCase('HTTPResponse')).toBe('http-response');
  });

  it('converts snake_case strings to kebab-case', () => {
    expect(toKebabCase('snake_case_string')).toBe('snake-case-string');
    expect(toKebabCase('user_profile_id')).toBe('user-profile-id');
  });

  it('converts space-separated strings to kebab-case', () => {
    expect(toKebabCase('Space separated string')).toBe(
      'space-separated-string',
    );
    expect(toKebabCase('User Profile Data')).toBe('user-profile-data');
  });

  it('handles mixed format strings', () => {
    expect(toKebabCase('Mixed format_STRING withSpaces')).toBe(
      'mixed-format-string-with-spaces',
    );
    expect(toKebabCase('user_Profile dataJSON')).toBe('user-profile-data-json');
  });

  it('trims whitespace from the input', () => {
    expect(toKebabCase('  leading space')).toBe('leading-space');
    expect(toKebabCase('trailing space  ')).toBe('trailing-space');
    expect(toKebabCase('  both sides  ')).toBe('both-sides');
  });

  it('handles strings that are already kebab-case', () => {
    expect(toKebabCase('already-kebab-case')).toBe('already-kebab-case');
    expect(toKebabCase('simple-string')).toBe('simple-string');
  });

  it('handles empty strings and single words', () => {
    expect(toKebabCase('')).toBe('');
    expect(toKebabCase('word')).toBe('word');
    expect(toKebabCase('UPPERCASE')).toBe('uppercase');
  });

  it('handles strings with numbers', () => {
    expect(toKebabCase('version123Release')).toBe('version-123-release');
    expect(toKebabCase('user_id_42')).toBe('user-id-42');
    expect(toKebabCase('Section 2 Title')).toBe('section-2-title');
  });

  it('handles strings with special characters', () => {
    expect(toKebabCase('special_chars-mixed&here')).toBe(
      'special-chars-mixed-here',
    );
  });
});
