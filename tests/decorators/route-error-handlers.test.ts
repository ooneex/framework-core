import { describe, expect, it } from 'bun:test';
import {
  type ContextType,
  ControllerDecoratorException,
  EContainerScope,
  type IResponse,
  Route,
  container,
  inject,
} from '@';

describe('Route Error Handlers Decorators', () => {
  describe('Common behavior for error handlers', () => {
    it('should register both notFound and serverError controllers', () => {
      @Route.notFound()
      class NotFoundController {
        public action({ response }: ContextType): IResponse {
          return response.json({ message: 'Resource not found' }, 404);
        }
      }

      @Route.serverError()
      class ServerErrorController {
        public action({ response }: ContextType): IResponse {
          return response.json({ message: 'Server error occurred' }, 500);
        }
      }

      const notFoundInstance = container.get(NotFoundController);
      const serverErrorInstance = container.get(ServerErrorController);

      expect(notFoundInstance).toBeInstanceOf(NotFoundController);
      expect(serverErrorInstance).toBeInstanceOf(ServerErrorController);
    });

    it('should enforce Controller naming convention for both decorators', () => {
      class InvalidNotFound {
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }
      class InvalidServerError {
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }

      expect(() => {
        Route.notFound()(InvalidNotFound);
      }).toThrow(ControllerDecoratorException);

      expect(() => {
        Route.serverError()(InvalidServerError);
      }).toThrow(ControllerDecoratorException);
    });
  });

  describe('Scoping behavior', () => {
    it('should honor different scopes for different controllers', () => {
      @Route.notFound(EContainerScope.Singleton)
      class GlobalNotFoundController {
        constructor() {
          this.id = Math.random();
        }
        private id: number;
        public getId() {
          return this.id;
        }
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }

      @Route.serverError(EContainerScope.Transient)
      class DynamicServerErrorController {
        constructor() {
          this.id = Math.random();
        }
        private id: number;
        public getId() {
          return this.id;
        }
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }

      const notFound1 = container.get(GlobalNotFoundController);
      const notFound2 = container.get(GlobalNotFoundController);
      expect(notFound1.getId()).toBe(notFound2.getId());

      const serverError1 = container.get(DynamicServerErrorController);
      const serverError2 = container.get(DynamicServerErrorController);
      expect(serverError1.getId()).not.toBe(serverError2.getId());
    });

    it('should work with request scope', () => {
      @Route.notFound(EContainerScope.Request)
      class RequestScopedNotFoundController {
        constructor() {
          this.id = Math.random();
        }
        private id: number;
        public getId() {
          return this.id;
        }
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }

      const controller = container.get(RequestScopedNotFoundController);
      expect(controller).toBeInstanceOf(RequestScopedNotFoundController);
    });
  });

  describe('Integration with dependency injection', () => {
    it('should work with injected dependencies', () => {
      class ErrorLogger {
        log(message: string) {
          return `Logged: ${message}`;
        }
      }

      container.bind(ErrorLogger).toSelf().inSingletonScope();

      @Route.notFound()
      class NotFoundWithDepsController {
        constructor(@inject(ErrorLogger) private logger: ErrorLogger) {}

        public action({ response }: ContextType): IResponse {
          const logMessage = this.logger.log('Resource not found');
          return response.json({ message: logMessage }, 404);
        }

        public getLogger() {
          return this.logger;
        }
      }

      const controller = container.get(NotFoundWithDepsController);
      expect(controller).toBeInstanceOf(NotFoundWithDepsController);
      expect(controller.getLogger()).toBeInstanceOf(ErrorLogger);
      expect(controller.getLogger().log('test')).toBe('Logged: test');
    });
  });

  describe('Edge cases', () => {
    it('should handle class that extends another class', () => {
      class BaseController {
        protected getMessage() {
          return 'Base message';
        }
      }

      @Route.notFound()
      class ExtendedNotFoundController extends BaseController {
        public action({ response }: ContextType): IResponse {
          return response.json({ message: this.getMessage() }, 404);
        }
      }

      const controller = container.get(ExtendedNotFoundController);
      expect(controller).toBeInstanceOf(ExtendedNotFoundController);
      expect(controller).toBeInstanceOf(BaseController);
    });

    it('should properly handle multiple error handlers of same type', () => {
      @Route.notFound()
      class FirstNotFoundController {
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }

      @Route.notFound()
      class SecondNotFoundController {
        public action({ response }: ContextType) {
          return response.json({ message: 'Not found' });
        }
      }

      const first = container.get(FirstNotFoundController);
      const second = container.get(SecondNotFoundController);

      expect(first).toBeInstanceOf(FirstNotFoundController);
      expect(second).toBeInstanceOf(SecondNotFoundController);
      expect(first).not.toBe(second);
    });
  });
});
