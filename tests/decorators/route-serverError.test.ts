import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  ControllerDecoratorException,
  EContainerScope,
  Route,
  container,
} from '@';

describe('Route.serverError Decorator', () => {
  it('should register a controller with singleton scope by default', () => {
    @Route.serverError()
    class ServerErrorController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Not found' });
      }
    }

    const controller = container.get(ServerErrorController);
    expect(controller).toBeInstanceOf(ServerErrorController);

    const controller2 = container.get(ServerErrorController);
    expect(controller2).toBe(controller);
  });

  it('should register a controller with specified scope', () => {
    @Route.serverError(EContainerScope.Transient)
    class CustomServerErrorController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Not found' });
      }
    }

    const controller = container.get(CustomServerErrorController);
    expect(controller).toBeInstanceOf(CustomServerErrorController);

    const controller2 = container.get(CustomServerErrorController);
    expect(controller2).not.toBe(controller);
    expect(controller2).toBeInstanceOf(CustomServerErrorController);
  });

  it('should throw an exception if class name does not end with Controller', () => {
    class InvalidServerError {
      public action({ response }: ContextType) {
        return response.json({ message: 'Not found' });
      }
    }

    expect(() => {
      Route.serverError()(InvalidServerError);
    }).toThrow(ControllerDecoratorException);

    expect(() => {
      Route.serverError()(InvalidServerError);
    }).toThrow(
      'ServerError decorator can only be used on controller classes. InvalidServerError must end with Controller keyword.',
    );
  });
});
