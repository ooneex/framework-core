import type { IRequestFile, IStorage, MimeType } from './types';
import { random } from './utils/random';
import { toKebabCase } from './utils/toKebabCase';

export class RequestFile implements IRequestFile {
  public readonly name: string;
  public readonly originalName: string;
  public readonly type: MimeType;
  public readonly size: number;
  public readonly extension: string;
  public readonly isImage: boolean;
  public readonly isSvg: boolean;
  public readonly isVideo: boolean;
  public readonly isAudio: boolean;
  public readonly isPdf: boolean;
  public readonly isText: boolean;
  public readonly isExcel: boolean;
  public readonly isCsv: boolean;
  public readonly isJson: boolean;
  public readonly isXml: boolean;
  public readonly isHtml: boolean;

  constructor(private readonly native: File) {
    const match = this.native.name.match(/\.([0-9a-z]+)$/i);
    this.extension = (match ? match[1] : '').toLowerCase();
    this.originalName = toKebabCase(
      this.native.name.replace(/\.[0-9a-z]*$/i, ''),
    );
    this.originalName = `${this.originalName}.${this.extension}`;
    this.type = this.native.type.replace(/;*charset=.*$/, '') as MimeType;
    this.size = this.native.size;
    const id = random.nanoid(25);
    this.name = `${id}.${this.extension}`;
    this.isImage = this.type.toString().startsWith('image/');
    this.isSvg =
      this.type.toString().startsWith('image/svg+xml') &&
      this.extension === 'svg';
    this.isVideo = this.type.toString().startsWith('video/');
    this.isAudio = this.type.toString().startsWith('audio/');
    this.isPdf =
      this.type.toString().startsWith('application/pdf') &&
      this.extension === 'pdf';
    this.isText =
      this.type.toString().startsWith('text/plain') && this.extension === 'txt';
    this.isExcel = this.type
      .toString()
      .startsWith(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
    this.isCsv =
      this.type.toString().startsWith('text/csv') && this.extension === 'csv';
    this.isJson =
      (this.type.toString().startsWith('application/json') &&
        this.extension === 'json') ||
      (this.type.toString().startsWith('application/ld+json') &&
        this.extension === 'jsonld');
    this.isXml =
      this.type.toString().startsWith('application/xml') &&
      this.extension === 'xml';
    this.isHtml =
      this.type.toString().startsWith('text/html') && this.extension === 'html';
  }

  public async readAsArrayBuffer(): Promise<ArrayBuffer> {
    return await this.native.arrayBuffer();
  }

  public readAsStream(): ReadableStream<Uint8Array> {
    return this.native.stream();
  }

  public async readAsText(): Promise<string> {
    return await this.native.text();
  }

  public async write(path: string): Promise<void> {
    await Bun.write(path, this.native);
  }

  public async store(storage: IStorage, directory?: string): Promise<string> {
    await storage.put(
      directory ? `${directory}/${this.name}` : this.name,
      this.native,
    );

    return this.name;
  }
}
