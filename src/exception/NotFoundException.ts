import { STATUS_CODE } from '../status';
import { Exception } from './Exception';

export class NotFoundException<T = unknown> extends Exception<T> {
  constructor(
    message: string,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message, STATUS_CODE.NotFound, data);
  }
}
