import type { BunFile, IStorage, S3File, S3Options } from './types';

export abstract class AbstractStorage implements IStorage {
  protected client: Bun.S3Client | null = null;
  public abstract getOptions(): S3Options;

  public async exists(key: string): Promise<boolean> {
    const client = this.getClient();

    return await client.exists(key);
  }

  public async delete(key: string): Promise<void> {
    const client = this.getClient();

    await client.delete(key);
  }

  public async putFile(key: string, localPath: string): Promise<number> {
    const file = Bun.file(localPath);

    return await this.put(key, file);
  }

  public async put(
    key: string,
    content:
      | string
      | ArrayBuffer
      | SharedArrayBuffer
      | Request
      | Response
      | BunFile
      | S3File
      | Blob,
  ): Promise<number> {
    const s3file: S3File = this.getS3File(key);

    return await s3file.write(content);
  }

  public async getAsJson(key: string): Promise<any> {
    const s3file: S3File = this.getS3File(key);

    return await s3file.json();
  }

  public async getAsArrayBuffer(key: string): Promise<ArrayBuffer> {
    const s3file: S3File = this.getS3File(key);

    return await s3file.arrayBuffer();
  }

  public getAsStream(key: string): ReadableStream {
    const s3file: S3File = this.getS3File(key);

    return s3file.stream();
  }

  private getClient(): Bun.S3Client {
    if (!this.client) {
      this.client = new Bun.S3Client(this.getOptions());
    }

    return this.client;
  }

  private getS3File(path: string): S3File {
    const client = this.getClient();

    return client.file(path);
  }
}
