import {ErrorCause} from '../error.cause';

export class GroupCause {
  private constructor() {}

  static readonly NOT_MEMBER_OF_GROUP = new ErrorCause('NOT_MEMBER_OF_GROUP');
  static readonly ALREADY_MEMBER_OF_GROUP = new ErrorCause('ALREADY_MEMBER_OF_GROUP');
  static readonly JOIN_IS_NOT_PERMITTED = new ErrorCause('JOIN_IS_NOT_PERMITTED');
  static readonly NOT_MEMBER_OF_THE_GROUP = new ErrorCause('NOT_MEMBER_OF_THE_GROUP');
  static readonly BANNED_USER = new ErrorCause('BANNED_USER');
  static readonly JOIN_REQUEST_PENDING = new ErrorCause('JOIN_REQUEST_PENDING');
}
