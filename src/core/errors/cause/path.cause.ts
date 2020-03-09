import {ErrorCause} from '../error.cause';

export class PathCause {
  private constructor() {}

  static readonly PATH_ALREADY_PUBLISHED = new ErrorCause('PATH_ALREADY_PUBLISHED');
}
