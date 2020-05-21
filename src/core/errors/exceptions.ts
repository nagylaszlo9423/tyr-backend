import {ErrorResponse} from './error.response';
import {HttpException} from '@nestjs/common';
import {ErrorCause} from './error.cause';
import {GeneralCause} from './cause/general.cause';

export class GeneralException extends HttpException {
  constructor(cause: ErrorCause) {
    super(new ErrorResponse(cause), 422);
  }
}

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(new ErrorResponse(GeneralCause.BAD_REQUEST, message), 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super(new ErrorResponse(GeneralCause.UNAUTHORIZED), 401);
  }
}

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(new ErrorResponse(GeneralCause.NOT_FOUND, message), 404);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super(new ErrorResponse(GeneralCause.FORBIDDEN), 403);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message?: string) {
    super(new ErrorResponse(GeneralCause.INTERNAL_SERVER_ERROR, message), 500);
  }
}
