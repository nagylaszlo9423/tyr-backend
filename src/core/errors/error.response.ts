import {ErrorCause} from './error.cause';

export class ErrorResponse {
  constructor(public cause: ErrorCause, message?: string) {
  }
}
