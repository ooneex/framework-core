import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { AbstractStorage } from '@';
import { S3Client, type S3Options } from 'bun';

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
});
