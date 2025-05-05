import {
  type ValidationArguments,
  type ValidationError,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  registerDecorator,
  validate,
  validateOrReject,
  validateSync,
} from 'class-validator';

export const Validation = {
  validate,
  validateSync,
  validateOrReject,
  decorator: {
    constraint: ValidatorConstraint,
    register: registerDecorator,
  },
};

export type ValidationType = {
  IConstraint: ValidatorConstraintInterface;
  Error: ValidationError;
  Options: ValidationOptions;
  Arguments: ValidationArguments;
};
