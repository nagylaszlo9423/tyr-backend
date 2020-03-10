import {Controller, Get} from '@nestjs/common';
import {UserService} from './user.service';
import {ProfileInfoResponse} from '../../dtos/user/profile-info.response';

@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {}

  @Get('/profile/info')
  getProfileInfo(): Promise<ProfileInfoResponse> {
    return this.userService.getProfileInfo();
  }
}
