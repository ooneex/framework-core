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

export interface IValidatorConstraint extends ValidatorConstraintInterface {}
export type ValidationErrorType = ValidationError;
export type ValidationOptionsType = ValidationOptions;
export type ValidationArgumentsType = ValidationArguments;
