import {Body, Controller, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {GroupService} from "./group.service";
import {CreateGroupRequest, GroupResponse, PageResponse, UpdateGroupRequest} from "tyr-api";
import {PaginationOptions} from "../../core/util/pagination";


@Controller('group')
export class GroupController {

  constructor(private groupService: GroupService) {
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<GroupResponse> {
    return this.groupService.findById(id);
  }

  @Get('page')
  findAllGroupsPaged(@Query('page') page: number, @Query('size') size: number): Promise<PageResponse> {
    return this.groupService.findAllGroupsByPage(PaginationOptions.of(page, size));
  }

  @Post(':id/join')
  join(@Param('id') groupId: string) {
    return this.groupService.join(groupId);
  }

  @Post(':id/leave')
  leave(@Param('id') groupId: string) {
    return this.groupService.leave(groupId);
  }

  @Post()
  async create(@Body() createRequest: CreateGroupRequest): Promise<string> {
    return Promise.resolve('');
  }

  @Put(':id')
  async update(@Param('id') groupId: string,
               @Body() updateRequest: UpdateGroupRequest): Promise<void> {
    return Promise.resolve();
  }

  @Delete(':id')
  async deleteGroup(@Param('id') groupId: string) {

  }
}
