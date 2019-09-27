import {ErrorResponse} from "./error.response";
import {HttpException} from "@nestjs/common";


abstract class GeneralException extends HttpException {
  protected constructor(response: ErrorResponse) {
    super(response, 422);
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

export class EmailAlreadyRegisteredException extends GeneralException {
  constructor() {
    super(new ErrorResponse('EMAIL_ALREADY_REGISTERED'));
  }
}

export class LoginDeniedException extends GeneralException {
  constructor() {
    super(new ErrorResponse('LOGIN_DENIED'));
  }
}

export class InvalidTokenException extends GeneralException {
  constructor() {
    super(new ErrorResponse('INVALID_TOKEN'));
  }
}

export class InvalidAuthorizationCode extends GeneralException{
  constructor() {
    super(new ErrorResponse('INVALID_AUTHORIZATION_CODE'));
  }
}
