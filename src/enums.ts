export enum Env {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export enum EScope {
  Env = 'env',
  Payload = 'payload',
  Params = 'params',
  Queries = 'queries',
}

export enum EMiddlewareScope {
  Request = 'request',
  Response = 'response',
}

export enum EContainerScope {
  Singleton = 'singleton',
  Transient = 'transient',
  Request = 'request',
}
