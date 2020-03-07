import {Controller, Get, Param, ParseIntPipe, Query} from "@nestjs/common";
import {UserService} from "./user.service";
import {PageResponse} from "../../core/dto/page.response";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";
import {GroupMemberResponse} from "../../dtos/user/group-member.response";

@Controller('/user')
export class UserController {

  constructor(private userService: UserService) {}

  @Get('/group-members/:groupId/page')
  findMembersByGroup(@Param('groupId') groupId: string,
                     @Query('page', ParseIntPipe) page: number,
                     @Query('size', ParseIntPipe) size: number): Promise<PageResponse<GroupMemberResponse>> {
    return this.userService.findMembersByGroup(groupId, PaginationOptions.of(page, size));
  }
}
