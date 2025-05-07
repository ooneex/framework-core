import { describe, expect, it, mock } from 'bun:test';
import type { ContextType, IResponse } from '@';
import { HttpResponse, container } from '@';
import { runMiddleware } from '../../src/router/handleRoute';

describe('runMiddleware', () => {
  // @ts-ignore: trust me
  const mockContext: ContextType = {
    request: {} as any,
    route: {} as any,
    ip: '127.0.0.1',
    host: 'localhost',
    path: '/test',
    method: 'GET',
    params: {},
    payload: {},
    queries: {},
    files: {},
    cookies: null,
    form: null,
    language: { code: 'en', region: 'US' },
    state: {},
    response: new HttpResponse(),
  };

  it('should return updated context when middleware returns context', async () => {
    // Mock middleware class
    class TestMiddleware {
      next(context: ContextType): ContextType {
        // Update the context and return it
        return {
          ...context,
          state: { ...context.state, middlewareRan: true },
        };
      }
    }

    // Mock container.get to return our middleware instance
    const originalGet = container.get;
    container.get = mock((cls) => {
      if (cls === TestMiddleware) {
        return new TestMiddleware();
      }
      return originalGet(cls);
    });

    // Run the middleware
    const result = await runMiddleware(TestMiddleware, mockContext);

    // Verify result
    expect(result).not.toBeInstanceOf(HttpResponse);
    expect((result as ContextType).state).toEqual({ middlewareRan: true });

    // Restore original container.get
    container.get = originalGet;
  });

  it('should return HttpResponse when middleware returns response', async () => {
    // Mock middleware class that returns HttpResponse
    class ResponseMiddleware {
      next(_context: ContextType): IResponse {
        const response = new HttpResponse();
        return response.json({ message: 'Middleware response' });
      }
    }

    // Mock container.get to return our middleware instance
    const originalGet = container.get;
    container.get = mock((cls) => {
      if (cls === ResponseMiddleware) {
        return new ResponseMiddleware();
      }
      return originalGet(cls);
    });

    // Run the middleware
    const result = await runMiddleware(ResponseMiddleware, mockContext);

    // Verify result
    expect(result).toBeInstanceOf(HttpResponse);
    expect((result as HttpResponse).getData()).toEqual({
      message: 'Middleware response',
    });

    // Restore original container.get
    container.get = originalGet;
  });

  it('should handle async middleware', async () => {
    // Mock async middleware
    class AsyncMiddleware {
      async next(context: ContextType): Promise<ContextType> {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10));
        return {
          ...context,
          state: { ...context.state, asyncMiddlewareRan: true },
        };
      }
    }

    // Mock container.get
    const originalGet = container.get;
    container.get = mock((cls) => {
      if (cls === AsyncMiddleware) {
        return new AsyncMiddleware();
      }
      return originalGet(cls);
    });

    // Run the middleware
    const result = await runMiddleware(AsyncMiddleware, mockContext);

    // Verify result
    expect(result).not.toBeInstanceOf(HttpResponse);
    expect((result as ContextType).state).toEqual({ asyncMiddlewareRan: true });

    // Restore original container.get
    container.get = originalGet;
  });

  it('should properly handle middleware that throws an error', async () => {
    // Mock middleware that throws
    class ErrorMiddleware {
      next(_context: ContextType): ContextType {
        throw new Error('Middleware error');
      }
    }

    // Mock container.get
    const originalGet = container.get;
    container.get = mock((cls) => {
      if (cls === ErrorMiddleware) {
        return new ErrorMiddleware();
      }
      return originalGet(cls);
    });

    // Run the middleware and expect it to throw
    expect(runMiddleware(ErrorMiddleware, mockContext)).rejects.toThrow(
      'Middleware error',
    );

    // Restore original container.get
    container.get = originalGet;
  });
});
