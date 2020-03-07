import {User} from "./user.schema";
import {GroupMemberResponse} from "../../dtos/user/group-member.response";

export class UserMapper {

  private constructor() {}

  static entityListToPublicResponse(user: User[]): GroupMemberResponse[] {
    return user.map(UserMapper.entityToPublicResponse);
  }

  static entityToPublicResponse(user: User): GroupMemberResponse {
    return new GroupMemberResponse({
      id: user._id,
      email: user.email
    });
  }

}
