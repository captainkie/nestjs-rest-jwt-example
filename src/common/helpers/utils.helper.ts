export class Response {
  static unauthorizedSchema() {
    return {
      example: {
        statusCode: <number>401,
        message: <string>'Unauthorized',
      },
    };
  }

  static badRequest() {
    return {
      example: {
        statusCode: <number>400,
        message: <string[]>[],
        error: 'Bad Request',
      },
    };
  }

  static forbidden() {
    return {
      example: {
        statusCode: <number>403,
        message: <string[]>[],
        error: 'Access Denied',
      },
    };
  }

  static notFound() {
    return {
      example: {
        statusCode: <number>404,
        message: <string>'Not Found',
      },
    };
  }

  static unprocessableEntity() {
    return {
      example: {
        statusCode: <number>422,
        message: <string>'Unprocessable Entity',
      },
    };
  }
}
