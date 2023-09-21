import {
  ApiUnauthorizedResponse as ApiUnauthorized,
  ApiBadRequestResponse as ApiBadRequest,
  ApiUnprocessableEntityResponse as ApiUnprocessableEntity,
  ApiInternalServerErrorResponse as ApiInternalServerError,
} from '@nestjs/swagger';

import { applyDecorators } from '@nestjs/common';

export function ApiUnauthorizedResponse(message = 'Unauthorized') {
  return applyDecorators(
    ApiUnauthorized({
      schema: {
        example: {
          statusCode: <number>401,
          message: <string>message,
        },
      },
    }),
  );
}

export function ApiBadRequestResponse() {
  return applyDecorators(
    ApiBadRequest({
      schema: {
        example: {
          statusCode: <number>400,
          message: <string[]>[],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiUnprocessableEntityResponse() {
  return applyDecorators(
    ApiUnprocessableEntity({
      schema: {
        example: {
          statusCode: <number>422,
          message: <string>'Unprocessable Entity',
        },
      },
    }),
  );
}

export function ApiInternalServerErrorResponse() {
  return applyDecorators(
    ApiInternalServerError({
      schema: {
        example: {
          statusCode: <number>500,
          message: <string>'Internal server error',
        },
      },
    }),
  );
}
