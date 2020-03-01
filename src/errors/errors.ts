import {ErrorResponse} from "./error.response";
import {HttpException} from "@nestjs/common";

export type Cause =
  'PATH_ALREADY_PUBLISHED' |
  'NOT_MEMBER_OF_THE_GROUP' |
  'BAD_REQUEST' |
  'UNAUTHORIZED' |
  'EMAIL_ALREADY_REGISTERED' |
  'LOGIN_DENIED' |
  'INVALID_TOKEN' |
  'NOT_FOUND' |
  'FORBIDDEN' |
  'INTERNAL_SERVER_ERROR' |
  'INVALID_AUTHORIZATION_CODE';

export class GeneralException extends HttpException {
  constructor(cause: Cause) {
    super(new ErrorResponse(cause), 422);
  }
}

export class BadRequestException extends HttpException {
  constructor() {
    super(new ErrorResponse('BAD_REQUEST'), 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super(new ErrorResponse('UNAUTHORIZED'), 401);
  }
}

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(new ErrorResponse('NOT_FOUND', message), 404);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super(new ErrorResponse('FORBIDDEN'), 403);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor() {
    super(new ErrorResponse('INTERNAL_SERVER_ERROR'), 500);
  }
}
