import {ErrorCause} from '../error.cause';

export class PathCause {
  private constructor() {}

  static readonly PATH_ALREADY_PUBLISHED = new ErrorCause('PATH_ALREADY_PUBLISHED');
  static readonly INVALID_GEO_FEATURE_TYPE = new ErrorCause('INVALID_GEO_FEATURE_TYPE');
}
