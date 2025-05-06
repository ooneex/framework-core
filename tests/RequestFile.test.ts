import { describe, expect, it, spyOn } from 'bun:test';
import { type IStorage, RequestFile } from '@';

describe('RequestFile', () => {
  it('should process file properties correctly', () => {
    const file = new File(['test content'], 'test-file.txt', {
      type: 'text/plain',
    });
    const requestFile = new RequestFile(file);

    expect(requestFile.extension).toBe('txt');
    expect(requestFile.originalName).toBe('test-file.txt');
    expect(requestFile.type).toBe('text/plain' as any);
    expect(requestFile.size).toBe(12);
    expect(requestFile.name).toMatch(/^[A-Za-z0-9_-]{25}\.txt$/);
    expect(requestFile.isImage).toBe(false);
  });

  it('should handle image files correctly', () => {
    const imageFile = new File(['fake image data'], 'test-image.jpg', {
      type: 'image/jpeg',
    });
    const requestFile = new RequestFile(imageFile);

    expect(requestFile.extension).toBe('jpg');
    expect(requestFile.originalName).toBe('test-image.jpg');
    expect(requestFile.type).toBe('image/jpeg');
    expect(requestFile.isImage).toBe(true);
  });

  it('should handle files without extensions', () => {
    const file = new File(['content'], 'testfile', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    expect(requestFile.extension).toBe('');
    expect(requestFile.originalName).toBe('testfile.');
    expect(requestFile.name).toMatch(/^[A-Za-z0-9_-]{25}\.$/);
  });

  it('should get file data as ArrayBuffer', async () => {
    const content = 'test content';
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    const data = await requestFile.readAsArrayBuffer();
    expect(data).toBeInstanceOf(ArrayBuffer);

    const decoder = new TextDecoder();
    const decodedContent = decoder.decode(data);
    expect(decodedContent).toBe(content);
  });

  it('should get file as ReadableStream', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    const stream = requestFile.readAsStream();
    expect(stream).toBeInstanceOf(ReadableStream);
  });

  it('should read file as text', async () => {
    const content = 'test content';
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    const text = await requestFile.readAsText();
    expect(text).toBe(content);
  });

  it('should write file to disk', async () => {
    const content = 'test content';
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    const spyWrite = spyOn(Bun, 'write').mockReturnValue(Promise.resolve(12));
    await requestFile.write('test.txt');

    expect(spyWrite).toHaveBeenCalledWith('test.txt', file);
  });

  it('should detect image type', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(true);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect video type', () => {
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(true);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect audio type', () => {
    const file = new File(['content'], 'test.mp3', { type: 'audio/mpeg' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(true);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect PDF type', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(true);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect text type', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(true);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect Excel type', () => {
    const file = new File(['content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(true);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect CSV type', () => {
    const file = new File(['content'], 'test.csv', { type: 'text/csv' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(true);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect JSON type', () => {
    const file = new File(['content'], 'test.json', {
      type: 'application/json',
    });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(true);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect XML type', () => {
    const file = new File(['content'], 'test.xml', { type: 'application/xml' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(true);
    expect(requestFile.isHtml).toBe(false);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect HTML type', () => {
    const file = new File(['content'], 'test.html', { type: 'text/html' });
    const requestFile = new RequestFile(file);
    expect(requestFile.isImage).toBe(false);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(true);
    expect(requestFile.isSvg).toBe(false);
  });

  it('should detect SVG type', () => {
    const file = new File(['content'], 'test.svg', {
      type: 'image/svg+xml',
    });
    const requestFile = new RequestFile(file);
    expect(requestFile.isSvg).toBe(true);
    expect(requestFile.isImage).toBe(true);
    expect(requestFile.isVideo).toBe(false);
    expect(requestFile.isAudio).toBe(false);
    expect(requestFile.isPdf).toBe(false);
    expect(requestFile.isText).toBe(false);
    expect(requestFile.isExcel).toBe(false);
    expect(requestFile.isCsv).toBe(false);
    expect(requestFile.isJson).toBe(false);
    expect(requestFile.isXml).toBe(false);
    expect(requestFile.isHtml).toBe(false);
  });

  it('should write file to path', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    const spyWrite = spyOn(Bun, 'write');
    await requestFile.write('/tmp/test.txt');

    expect(spyWrite).toHaveBeenCalledWith('/tmp/test.txt', file);
  });

  it('should store file', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const requestFile = new RequestFile(file);

    class PdfStorage implements IStorage {
      public async exists(): Promise<boolean> {
        return true;
      }
      public async delete(): Promise<void> {
        return;
      }
      public async putFile(): Promise<number> {
        return 0;
      }
      public async put(): Promise<number> {
        return 0;
      }
      public async getAsJson(): Promise<any> {
        return {};
      }
      public async getAsArrayBuffer(): Promise<ArrayBuffer> {
        return new ArrayBuffer(0);
      }
      public getAsStream(): ReadableStream {
        return new ReadableStream();
      }
    }

    const storage = new PdfStorage();
    const storageSpy = spyOn(storage, 'put');

    requestFile.store(storage);
    expect(storageSpy).toHaveBeenCalled();
  });
});
