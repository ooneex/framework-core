import type { BunRequest, Server } from 'bun';
import { plainToClassFromExist } from 'class-transformer';
import { type ValidationError, validateSync } from 'class-validator';
import { ValidationException } from 'src/exceptions/ValidationException';
import { HttpResponse } from '../HttpResponse';
import { buildContext } from '../buildContext';
import { container } from '../container';
import type {
  ContextType,
  IResponse,
  MiddlewareScopeType,
  MiddlewareType,
  RouteConfigType,
  ValidationResultType,
  ValidatorType,
} from '../types';

export const handleRoute = async (config: {
  request: BunRequest;
  server?: Server;
  ip?: string;
  route: RouteConfigType;
  middlewares?: Record<MiddlewareScopeType, MiddlewareType[]>;
}): Promise<Response> => {
  let context = await buildContext({
    request: config.request,
    server: config.server,
    ip: config.ip,
  });

  const globalRequestMiddlewares = config.middlewares?.request || [];
  for (const middleware of globalRequestMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  //  TODO: check roles

  const controllerRequestMiddlewares = config.route.middlewares?.request || [];
  for (const middleware of controllerRequestMiddlewares) {
    const response = await runMiddleware(middleware, context);
    if (response instanceof HttpResponse) {
      return response.build(context.request);
    }
    context = response as ContextType;
  }

  const controllerParamsValidators = config.route.validators?.params || [];
  await runValidator(controllerParamsValidators, context.params);
  const controllerPayloadValidators = config.route.validators?.payload || [];
  await runValidator(controllerPayloadValidators, context.payload);
  const controllerQueriesValidators = config.route.validators?.queries || [];
  await runValidator(controllerQueriesValidators, context.queries);

  const controller = container.get(config.route.controller);
  context.response = await controller.action(context);

  const controllerResponseValidators = config.route.validators?.response || [];
  const data = context.response.getData();
  if (data) {
    await runValidator(controllerResponseValidators, data);
  }

  const controllerResponseMiddlewares =
    config.route.middlewares?.response || [];
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

const runMiddleware = async (
  middleware: MiddlewareType,
  context: ContextType,
): Promise<ContextType | IResponse> => {
  const instance = container.get(middleware);
  const response = await instance.next(context);
  if (response instanceof HttpResponse) {
    return response;
  }
  context = response as ContextType;

  return context;
};

const runValidator = async (
  validators: ValidatorType[],
  data: Record<string, any>,
): Promise<void> => {
  for (const validator of validators) {
    const instance = plainToClassFromExist(container.get(validator), data);

    const errors = validateSync(instance, {
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

const parseValidationErrors = (
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
