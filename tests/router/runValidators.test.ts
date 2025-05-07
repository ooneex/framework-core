import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Assert, ValidationException, container, validator } from '@';
import { runValidators } from '../../src/router/handleRoute';

// Manual mock for container.get
const originalGet = container.get;
let mockValidatorInstance: any = null;

// Override container.get before tests
// @ts-ignore - we're deliberately mocking this method
container.get = (validator: any) => {
  if (mockValidatorInstance) {
    return mockValidatorInstance;
  }
  return originalGet.call(container, validator);
};

describe('runValidators', () => {
  @validator()
  class TestRunValidator {
    @Assert.IsNotEmpty()
    name: string;
  }

  @validator()
  class EmailRunValidator {
    @Assert.IsEmail()
    email: string;
  }

  @validator()
  class ComplexRunValidator {
    @Assert.IsNotEmpty()
    firstName: string;

    @Assert.IsNotEmpty()
    lastName: string;

    @Assert.IsEmail()
    email: string;
  }

  // Reset mock before each test
  beforeEach(() => {
    mockValidatorInstance = null;
  });

  // Restore original container.get after tests
  afterEach(() => {
    // @ts-ignore
    container.get = originalGet;
  });

  it('should validate successfully with valid data', async () => {
    const validators = [TestRunValidator];
    const data = { name: 'John Doe' };

    expect(async () => {
      await runValidators(validators, data);
    }).not.toThrow();
  });

  it('should throw ValidationException with invalid data', async () => {
    // Create actual validator instance with invalid data
    const validator = new TestRunValidator();
    validator.name = ''; // empty name will trigger validation error
    mockValidatorInstance = validator;

    const validators = [TestRunValidator];
    const data = { name: '' };

    expect(runValidators(validators, data)).rejects.toThrow(
      ValidationException,
    );
    expect(runValidators(validators, data)).rejects.toThrow(
      /name should not be empty/,
    );
  });

  it('should validate email format correctly', async () => {
    expect(async () => {
      await runValidators([EmailRunValidator], { email: 'test@example.com' });
    }).not.toThrow();

    expect(async () => {
      await runValidators([EmailRunValidator], { email: 'not-an-email' });
    }).toThrow('email must be an email');
  });

  it('should apply all validation rules correctly', async () => {
    // Create complex validator with invalid data
    const validator = new ComplexRunValidator();
    validator.firstName = '';
    validator.lastName = 'Doe';
    validator.email = 'invalid-email';
    mockValidatorInstance = validator;

    const validators = [ComplexRunValidator];
    const data = {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
    };

    try {
      await runValidators(validators, data);
      // If we reach here, validation didn't throw as expected
      expect(true).toBe(false);
    } catch (error) {
      if (!(error instanceof ValidationException)) {
        throw error;
      }

      // Check error structure
      const validationError = error as ValidationException;

      // Validate error structure
      expect(validationError.data).toBeDefined();
      if (validationError.data) {
        const errorData = validationError.data as {
          success: boolean;
          details: Array<{
            property: string;
            value: any;
            constraints: Array<{ name: string; message: string }>;
          }>;
        };

        expect(errorData.success).toBe(false);
        expect(Array.isArray(errorData.details)).toBe(true);
        expect(errorData.details.length).toBeGreaterThan(0);

        // First error should be about firstName
        const firstDetail = errorData.details[0];
        expect(firstDetail.property).toBe('firstName');
        expect(firstDetail.constraints[0].message).toMatch(
          /firstName should not be empty/,
        );
      }
    }
  });
});
