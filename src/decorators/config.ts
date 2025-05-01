import { EContainerScope } from '../enums';
import { ConfigDecoratorException } from '../exceptions/ConfigDecoratorException';
import type { ConfigType, ContainerScopeType } from '../types';
import { registerWithScope } from './registerWithScope';

export const config = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (config: ConfigType) => {
    const name = config.prototype.constructor.name;

    if (!name.endsWith('Config')) {
      throw new ConfigDecoratorException(
        `Config decorator can only be used on config classes. ${name} must end with Config keyword.`,
      );
    }

    registerWithScope(config, scope);
  };
};
