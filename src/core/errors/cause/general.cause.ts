import {ErrorCause} from '../error.cause';

export class GeneralCause {
  private constructor() {}

  static readonly INTERNAL_SERVER_ERROR = new ErrorCause('INTERNAL_SERVER_ERROR');
  static readonly FORBIDDEN = new ErrorCause('FORBIDDEN');
  static readonly NOT_FOUND = new ErrorCause('NOT_FOUND');
  static readonly UNAUTHORIZED = new ErrorCause('UNAUTHORIZED');
  static readonly BAD_REQUEST = new ErrorCause('BAD_REQUEST');

}
