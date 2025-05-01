import { EContainerScope } from '../enums';
import { MailerDecoratorException } from '../exceptions/MailerDecoratorException';
import type { ContainerScopeType, MailerType } from '../types';
import { registerWithScope } from './registerWithScope';

export const mailer = (
  scope: ContainerScopeType = EContainerScope.Singleton,
) => {
  return (mailer: MailerType) => {
    const name = mailer.prototype.constructor.name;

    if (!name.endsWith('Mailer')) {
      throw new MailerDecoratorException(
        `Mailer decorator can only be used on mailer classes. ${name} must end with Mailer keyword.`,
      );
    }

    registerWithScope(mailer, scope);
  };
};
