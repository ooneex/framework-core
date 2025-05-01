export class Exception<T = unknown> extends Error {
  public readonly date: Date = new Date();
  public readonly status: number | null = null;
  public readonly data: Readonly<Record<string, T>> | null = null;

  constructor(
    message: string | Error,
    status: number | null = null,
    data: Readonly<Record<string, T>> | null = null,
  ) {
    super(message instanceof Error ? (message as Error).message : message);

    this.status = status;
    this.data = data;
  }
}
