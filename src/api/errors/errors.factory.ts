import {HttpException} from "@nestjs/common";
import {ErrorResponse} from "./error.response";

abstract class GeneralException extends HttpException {
  protected constructor(code: string, message?: string) {
    super(new ErrorResponse(code, message), 422);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(new ErrorResponse(message, 'NOT_FOUND'), 404);
  }
}

export class EmailAlreadyRegistered extends GeneralException {
  constructor() {
    super('EMAIL_ALREADY_REGISTERED');
  }
}
