import type { StatusCodeType } from '../types';

export class Exception<T = unknown> extends Error {
  public readonly date: Date = new Date();
  public readonly status?: StatusCodeType;
  public readonly data: Readonly<Record<string, T>> | null = null;

  constructor(
    message: string | Error,
    status?: StatusCodeType,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message instanceof Error ? (message as Error).message : message);

    this.status = status;
    this.data = data;
  }
}
