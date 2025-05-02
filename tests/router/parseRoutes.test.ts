import { describe, expect, it } from 'bun:test';
import { type ContextType, Router } from '@';
import { parseRoutes } from '../../src/router/parseRoutes';

describe('router', () => {
  it('parseRoutes', async () => {
    class TestController {
      public action({ response }: ContextType) {
        return response.json({ message: 'Hello, World!' });
      }
    }

    const router = new Router();

    router.addRoute({
      name: 'add_user',
      path: '/users',
      method: 'POST',
      controller: TestController,
    });
    router.addRoute({
      name: 'retrieve_user',
      path: '/users',
      method: 'GET',
      controller: TestController,
    });
    router.addRoute({
      name: 'delete_user',
      path: '/users',
      method: 'DELETE',
      controller: TestController,
    });
    router.addRoute({
      name: 'add_post',
      path: '/posts',
      method: 'POST',
      controller: TestController,
    });

    const parsedRoutes = await parseRoutes(router);
    expect(parsedRoutes['/users'].POST).toBeFunction();
    expect(parsedRoutes['/users'].GET).toBeFunction();
    expect(parsedRoutes['/users'].DELETE).toBeFunction();
    expect(parsedRoutes['/posts'].POST).toBeFunction();
  });
});
