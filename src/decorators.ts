import type { RouteConfigType } from './types';

export const registerRoute = (config: RouteConfigType, classObject: any) => {};

export const Route = {
  get: (path: `/${string}`) => {
    return <
      T extends {
        new (
          ...args: any[]
        ): {
          action: (...args: any[]) => any;
        };
      },
    >(
      construct: T,
    ) => {
      registerRoute(
        {
          path,
          method: 'GET',
        },
        construct,
      );
    };
  },
};
