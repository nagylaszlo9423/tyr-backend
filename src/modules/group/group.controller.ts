import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from "@nestjs/common";
import {GroupService} from "./group.service";
import {CreateGroupRequest, GroupResponse, PageResponse, UpdateGroupRequest} from "tyr-api";
import {CreatedResponse} from "../../core/dto/created.response";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";


@Controller('/group')
export class GroupController {

  constructor(private groupService: GroupService) {
  }

  @Get('/page')
  findAllGroupsPaged(@Query('page', ParseIntPipe) page: number, @Query('size', ParseIntPipe) size: number): Promise<PageResponse> {
    return this.groupService.findAllGroupsByPage(PaginationOptions.of(page, size));
  }

  @Get('/:id')
  findById(@Param('id') id: string): Promise<GroupResponse> {
    return this.groupService.findById(id);
  }

  @Post('/:id/join')
  join(@Param('id') groupId: string) {
    return this.groupService.join(groupId);
  }

  @Post('/:id/leave')
  leave(@Param('id') groupId: string) {
    return this.groupService.leave(groupId);
  }

  @Post()
  async create(@Body() createRequest: CreateGroupRequest): Promise<CreatedResponse> {
    return this.groupService.create(createRequest);
  }

  @Put('/:id')
  async update(@Param('id') groupId: string,
               @Body() updateRequest: UpdateGroupRequest): Promise<void> {
    return this.groupService.update(updateRequest, groupId);
  }

  @Delete('/:id')
  async deleteGroup(@Param('id') groupId: string): Promise<void> {
    return this.groupService.delete(groupId);
  }
}
