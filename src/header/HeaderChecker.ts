import type { IHeaderChecker } from '../types';

export abstract class HeaderChecker implements IHeaderChecker {
  private headers: Headers;

  constructor(headers: Headers) {
    this.headers = headers;
  }

  public isJson(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/(?:ld\+)?json/i.test(contentType);
  }

  public isFormData(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /multipart\/form-data/i.test(contentType);
  }

  public isForm(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/x-www-form-urlencoded/i.test(contentType);
  }

  public isText(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /text\/css|\*|csv|html|plain|xml/i.test(contentType);
  }

  public isStream(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/octet-stream/i.test(contentType);
  }

  public isBlob(): boolean {
    return this.isStream();
  }

  public isHtml(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /text\/html/i.test(contentType);
  }
}
