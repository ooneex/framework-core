import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  ControllerDecoratorException,
  EContainerScope,
  Route,
  container,
} from '@';

describe('Route.notFound Decorator', () => {
  it('should register a controller with singleton scope by default', () => {
    @Route.notFound()
    class NotFoundController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Not found' });
      }
    }

    const controller = container.get(NotFoundController);
    expect(controller).toBeInstanceOf(NotFoundController);

    const controller2 = container.get(NotFoundController);
    expect(controller2).toBe(controller);
  });

  it('should register a controller with specified scope', () => {
    @Route.notFound(EContainerScope.Transient)
    class CustomNotFoundController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Not found' });
      }
    }

    const controller = container.get(CustomNotFoundController);
    expect(controller).toBeInstanceOf(CustomNotFoundController);

    const controller2 = container.get(CustomNotFoundController);
    expect(controller2).not.toBe(controller);
    expect(controller2).toBeInstanceOf(CustomNotFoundController);
  });

  it('should throw an exception if class name does not end with Controller', () => {
    class InvalidNotFound {
      public action({ response }: ContextType) {
        return response.json({ message: 'Not found' });
      }
    }

    expect(() => {
      Route.notFound()(InvalidNotFound);
    }).toThrow(ControllerDecoratorException);

    expect(() => {
      Route.notFound()(InvalidNotFound);
    }).toThrow(
      'NotFound decorator can only be used on controller classes. InvalidNotFound must end with Controller keyword.',
    );
  });
});
