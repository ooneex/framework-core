import { describe, expect, it } from 'bun:test';
import type { ValidationErrorType } from '@';
import { parseValidationErrors } from '../../src/router/handleRoute';

describe('parseValidationErrors', () => {
  it('should return a validation result with success set to false', () => {
    const errors: ValidationErrorType[] = [
      {
        property: 'username',
        value: '',
        constraints: {
          isNotEmpty: 'username should not be empty',
        },
      },
    ];

    const result = parseValidationErrors(errors);

    expect(result.success).toBe(false);
  });

  it('should transform validation errors into detailed structure', () => {
    const errors: ValidationErrorType[] = [
      {
        property: 'email',
        value: 'invalid-email',
        constraints: {
          isEmail: 'email must be an email',
        },
      },
    ];

    const result = parseValidationErrors(errors);

    expect(result.details).toHaveLength(1);
    expect(result.details[0].property).toBe('email');
    expect(result.details[0].value).toBe('invalid-email');
    expect(result.details[0].constraints).toHaveLength(1);
    expect(result.details[0].constraints[0].name).toBe('isEmail');
    expect(result.details[0].constraints[0].message).toBe(
      'email must be an email',
    );
  });

  it('should handle multiple constraints for a single property', () => {
    const errors: ValidationErrorType[] = [
      {
        property: 'password',
        value: 'abc',
        constraints: {
          minLength: 'password must be at least 8 characters',
          matches: 'password must contain at least one number',
        },
      },
    ];

    const result = parseValidationErrors(errors);

    expect(result.details).toHaveLength(1);
    expect(result.details[0].property).toBe('password');
    expect(result.details[0].constraints).toHaveLength(2);

    // The order may vary, so we'll check that both constraints exist
    const constraintNames = result.details[0].constraints.map((c) => c.name);
    expect(constraintNames).toContain('minLength');
    expect(constraintNames).toContain('matches');

    const minLengthConstraint = result.details[0].constraints.find(
      (c) => c.name === 'minLength',
    );
    expect(minLengthConstraint?.message).toBe(
      'password must be at least 8 characters',
    );

    const matchesConstraint = result.details[0].constraints.find(
      (c) => c.name === 'matches',
    );
    expect(matchesConstraint?.message).toBe(
      'password must contain at least one number',
    );
  });

  it('should handle multiple property errors', () => {
    const errors: ValidationErrorType[] = [
      {
        property: 'username',
        value: '',
        constraints: {
          isNotEmpty: 'username should not be empty',
        },
      },
      {
        property: 'email',
        value: 'invalid-email',
        constraints: {
          isEmail: 'email must be an email',
        },
      },
    ];

    const result = parseValidationErrors(errors);

    expect(result.details).toHaveLength(2);

    const usernameError = result.details.find((d) => d.property === 'username');
    expect(usernameError).toBeDefined();
    expect(usernameError?.constraints[0].message).toBe(
      'username should not be empty',
    );

    const emailError = result.details.find((d) => d.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError?.constraints[0].message).toBe('email must be an email');
  });

  it('should handle errors without constraints', () => {
    const errors: ValidationErrorType[] = [
      {
        property: 'username',
        value: '',
        constraints: undefined,
      },
    ];

    const result = parseValidationErrors(errors);

    expect(result.details).toHaveLength(1);
    expect(result.details[0].property).toBe('username');
    expect(result.details[0].constraints).toHaveLength(0);
  });
});
