import * as mongoose from 'mongoose';
import {User, UserSchemaDef} from './user.schema';
import {GroupMemberResponse} from '../../dtos/user/group-member.response';
import {PublicUserResponse} from '../../dtos/user/public-user.response';
import {isDocOf} from '../../core/util/db.helper';
import {InternalServerErrorException} from '../../core/errors/exceptions';
import {ProfileInfoResponse} from '../../dtos/user/profile-info.response';

export class UserMapper {

  private constructor() {}

  static modelToGroupMemberResponse(user: User): GroupMemberResponse {
    return new GroupMemberResponse({
      id: user._id,
      email: user.email,
    });
  }

  static modelToPublicUserResponse(user: User | mongoose.Types.ObjectId): PublicUserResponse {
    if (!isDocOf<User>(UserSchemaDef, user)) {
      throw new InternalServerErrorException(`The following object is not a user: ${user}`);
    }

    return {
      id: user.id,
    };
  }

  static modelToProfileInfoResponse(user: User): ProfileInfoResponse {
    return {
      id: user.id,
      email: user.email
    };
  }

}
