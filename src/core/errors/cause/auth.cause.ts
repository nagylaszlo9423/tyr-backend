import {ErrorCause} from '../error.cause';

export class AuthCause {
  private constructor() {}

  static readonly INVALID_AUTHORIZATION_CODE = new ErrorCause('INVALID_AUTHORIZATION_CODE');
  static readonly LOGIN_DENIED = new ErrorCause('LOGIN_DENIED');
  static readonly EMAIL_ALREADY_REGISTERED = new ErrorCause('EMAIL_ALREADY_REGISTERED');
  static readonly INVALID_TOKEN = new ErrorCause('INVALID_TOKEN');
}
