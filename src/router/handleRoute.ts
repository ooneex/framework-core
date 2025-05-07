import { plainToClassFromExist } from 'class-transformer';
import { type ValidationError, validate } from 'class-validator';
import { HttpResponse } from '../HttpResponse';
import { container } from '../container';
import { Exception } from '../exceptions/Exception';
import { NotFoundException } from '../exceptions/NotFoundException';
import { UnauthorizedException } from '../exceptions/UnauthorizedException';
import { ValidationException } from '../exceptions/ValidationException';
import type {
  ContextType,
  ControllerType,
  IResponse,
  MiddlewareScopeType,
  MiddlewareType,
  ValidationResultType,
  ValidatorType,
} from '../types';

export const handleRoute = async (config: {
  context: ContextType;
  middlewares?: Partial<Record<MiddlewareScopeType, MiddlewareType[]>>;
}): Promise<Response> => {
  let context = config.context;
  const route = context.route;

  if (!route) {
    throw new NotFoundException(
      'Route not found',
      buildExecptionDataFromContext(context),
    );
  }

  const globalRequestMiddlewares = config.middlewares?.request || [];
  for (const middleware of globalRequestMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  const controllerRequestMiddlewares = route.middlewares?.request || [];
  for (const middleware of controllerRequestMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  if (context.user && route.roles) {
    const userRoles = context.user.getRoles();
    const routeRoles = route.roles;

    for (const userRole of userRoles) {
      if (!routeRoles.includes(userRole)) {
        throw new UnauthorizedException(
          'Access denied',
          buildExecptionDataFromContext(context),
        );
      }
    }
  }

  const controllerParamsValidators = route.validators?.params || [];
  await runValidators(controllerParamsValidators, context.params);
  const controllerPayloadValidators = route.validators?.payload || [];
  await runValidators(controllerPayloadValidators, context.payload);
  const controllerQueriesValidators = route.validators?.queries || [];
  await runValidators(controllerQueriesValidators, context.queries);

  const controller = container.get(route.controller);
  context.response = await controller.action(context);

  const controllerResponseValidators = route.validators?.response || [];
  const data = context.response.getData();
  if (data) {
    await runValidators(controllerResponseValidators, data);
  }

  const controllerResponseMiddlewares = route.middlewares?.response || [];
  for (const middleware of controllerResponseMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  const globalResponseMiddlewares = config.middlewares?.response || [];
  for (const middleware of globalResponseMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  return context.response.build(context.request);
};

export const runMiddleware = async (
  middleware: MiddlewareType,
  context: ContextType,
): Promise<ContextType | IResponse> => {
  const instance = container.get(middleware);
  const response = await instance.next(context);
  if (response instanceof HttpResponse) {
    return response;
  }
  return response as ContextType;
};

export const runValidators = async (
  validators: ValidatorType[],
  data: Record<string, any>,
): Promise<void> => {
  for (const validator of validators) {
    const instance = plainToClassFromExist(container.get(validator), data);

    const errors = await validate(instance, {
      whitelist: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const validationError = parseValidationErrors(errors);

      throw new ValidationException(
        validationError.details[0].constraints[0].message,
        parseValidationErrors(errors),
      );
    }
  }
};

export const parseValidationErrors = (
  errors: ValidationError[],
): ValidationResultType => {
  return {
    success: false,
    details: errors.map((error) => ({
      property: error.property,
      value: error.value,
      constraints: Object.entries(error.constraints ?? {}).map(
        ([key, value]) => ({
          name: key,
          message: value,
        }),
      ),
    })),
  };
};

export const buildErrorResponse = async (config: {
  error: any;
  errorController?: ControllerType;
  context: ContextType;
}): Promise<Response> => {
  const error = config.error;
  const context = config.context;

  const exception: Exception =
    error instanceof Exception ? error : new Exception(error);
  config.context.exception = exception;

  if (config.errorController) {
    const controller = container.get(config.errorController);
    const response = await controller.action(context);
    return response.build(context.request);
  }

  context.response.exception(
    exception.message,
    exception.data,
    exception.status,
  );
  return context.response.build(context.request);
};

export const buildExecptionDataFromContext = (context: ContextType) => {
  return {
    state: context.state,
    params: context.params,
    payload: context.payload,
    queries: context.queries,
    language: context.language,
    path: context.path,
    method: context.method,
    ip: context.ip,
    host: context.host,
  };
};
