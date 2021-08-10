export class HTTPStatus {
  static BAD_REQUEST: number
  static CREATED: number
  static INTERNAL_SERVER_ERROR: number
  static OK: number
  static NOT_FOUND: number
}

const objectDefinition = {
  writable: false,
  enumerable: true,
  configurable: false,
}

Object.defineProperty(HTTPStatus, 'OK', {
  value: 200,
  ...objectDefinition,
})

Object.defineProperty(HTTPStatus, 'CREATED', {
  value: 201,
  ...objectDefinition,
})

Object.defineProperty(HTTPStatus, 'ACCEPTED', {
  value: 202,
  ...objectDefinition,
})

Object.defineProperty(HTTPStatus, 'BAD_REQUEST', {
  value: 400,
  ...objectDefinition,
})

Object.defineProperty(HTTPStatus, 'NOT_FOUND', {
  value: 404,
  ...objectDefinition,
})

Object.defineProperty(HTTPStatus, 'UNAUTHORIZED', {
  value: 401,
  ...objectDefinition,
})

Object.defineProperty(HTTPStatus, 'INTERNAL_SERVER_ERROR', {
  value: 500,
  ...objectDefinition,
})
