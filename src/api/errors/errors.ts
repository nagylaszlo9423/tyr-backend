import {HttpException} from "@nestjs/common";
import {ErrorResponse} from "./error.response";

abstract class GeneralException extends HttpException {
  protected constructor(code: string, message?: string) {
    super(new ErrorResponse(code, message), 422);
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
  constructor() {
    super(new ErrorResponse('NOT_FOUND'), 404);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super(new ErrorResponse('FORBIDDEN'), 403);
  }
}

export class EmailAlreadyRegisteredException extends GeneralException {
  constructor() {
    super('EMAIL_ALREADY_REGISTERED');
  }
}

export class LoginDeniedException extends GeneralException{
  constructor() {
    super('LOGIN_DENIED');
  }
}

export class InvalidTokenException extends GeneralException {
  constructor() {
    super('INVALID_TOKEN');
  }
}
