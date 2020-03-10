import {Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import {UserService} from './user.service';
import {PageResponse} from '../../core/dto/page.response';
import {PaginationOptions} from '../../core/util/pagination/pagination-options';
import {GroupMemberResponse} from '../../dtos/user/group-member.response';

@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {}
}
