import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { AbstractStorage } from '@';
import { S3Client, type S3File, type S3Options } from 'bun';

class TestStorage extends AbstractStorage {
  public getOptions(): S3Options {
    return {
      accessKeyId: 'test-key',
      secretAccessKey: 'test-secret',
      bucket: 'test-bucket',
      region: 'test-region',
    };
  }
}

describe('Storage', () => {
  let storage: TestStorage;

  beforeEach(() => {
    storage = new TestStorage();
  });

  it('should check if file exists', async () => {
    const spy = spyOn(S3Client.prototype, 'exists');
    spy.mockReturnValue(Promise.resolve(true));

    const exists = await storage.exists('test.txt');

    expect(exists).toBe(true);
    expect(spy).toHaveBeenCalledWith('test.txt');
  });

  it('should delete a file', async () => {
    const spy = spyOn(S3Client.prototype, 'delete');
    spy.mockReturnValue(Promise.resolve());

    await storage.delete('test.txt');

    expect(spy).toHaveBeenCalledWith('test.txt');
  });

  it('should get storage options', () => {
    const options = storage.getOptions();

    expect(options).toEqual({
      accessKeyId: 'test-key',
      secretAccessKey: 'test-secret',
      bucket: 'test-bucket',
      region: 'test-region',
    });
  });

  it('should put a file from local path', async () => {
    const mockBunFile = { size: 1024 } as Bun.BunFile;
    const fileSpy = spyOn(Bun, 'file').mockReturnValue(mockBunFile);

    const mockS3File = {
      write: () => Promise.resolve(1024),
    } as unknown as S3File;

    const fileMockSpy = spyOn(S3Client.prototype, 'file').mockReturnValue(
      mockS3File,
    );

    const size = await storage.putFile('test.txt', '/local/path/test.txt');

    expect(size).toBe(1024);
    expect(fileSpy).toHaveBeenCalledWith('/local/path/test.txt');
    expect(fileMockSpy).toHaveBeenCalledWith('test.txt');
  });

  it('should put content to s3', async () => {
    const content = 'test content';

    const mockS3File = {
      write: (data: any) => {
        expect(data).toBe(content);
        return Promise.resolve(content.length);
      },
    } as unknown as S3File;

    const fileMockSpy = spyOn(S3Client.prototype, 'file').mockReturnValue(
      mockS3File,
    );

    const size = await storage.put('test.txt', content);

    expect(size).toBe(content.length);
    expect(fileMockSpy).toHaveBeenCalledWith('test.txt');
  });

  it('should get content as JSON', async () => {
    const testData = { name: 'test', value: 123 };

    const mockS3File = {
      json: () => Promise.resolve(testData),
    } as unknown as S3File;

    const fileMockSpy = spyOn(S3Client.prototype, 'file').mockReturnValue(
      mockS3File,
    );

    const data = await storage.getAsJson('test.json');

    expect(data).toEqual(testData);
    expect(fileMockSpy).toHaveBeenCalledWith('test.json');
  });

  it('should get content as ArrayBuffer', async () => {
    const buffer = new ArrayBuffer(8);

    const mockS3File = {
      arrayBuffer: () => Promise.resolve(buffer),
    } as unknown as S3File;

    const fileMockSpy = spyOn(S3Client.prototype, 'file').mockReturnValue(
      mockS3File,
    );

    const result = await storage.getAsArrayBuffer('test.bin');

    expect(result).toBe(buffer);
    expect(fileMockSpy).toHaveBeenCalledWith('test.bin');
  });

  it('should get content as stream', () => {
    const mockStream = new ReadableStream();

    const mockS3File = {
      stream: () => mockStream,
    } as unknown as S3File;

    const fileMockSpy = spyOn(S3Client.prototype, 'file').mockReturnValue(
      mockS3File,
    );

    const stream = storage.getAsStream('test.bin');

    expect(stream).toBe(mockStream);
    expect(fileMockSpy).toHaveBeenCalledWith('test.bin');
  });
});
