import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import {GroupService} from './group.service';
import {PaginationOptions} from '../../core/util/pagination/pagination-options';
import {PageResponse} from '../../core/dto/page.response';
import {GroupResponse} from '../../dtos/group/group-response';
import {GroupRequest} from '../../dtos/group/group.request';
import {GroupFilter} from './enums/group-filter';
import {ParseIntArrayPipe} from '../../core/pipes/parse-int-array.pipe';
import {JoinStatusResponse} from '../../dtos/group/join-status.response';

@Controller('/group')
export class GroupController {

  constructor(private groupService: GroupService) {
  }

  @Get('/page')
  findAllGroupsPaged(@Query('filters', ParseIntArrayPipe) filters: GroupFilter[],
                     @Query('page', ParseIntPipe) page: number,
                     @Query('size', ParseIntPipe) size: number,
                     @Query('search') searchExp: string,
                     @Query('sortBy') sortBy: string): Promise<PageResponse<GroupResponse>> {
    return this.groupService.findAllGroupsByPage(PaginationOptions.of(page, size), filters, searchExp, sortBy);
  }

  @Get('/:groupId')
  findById(@Param('groupId') groupId: string): Promise<GroupResponse> {
    return this.groupService.findById(groupId);
  }

  @Post()
  create(@Body() createRequest: GroupRequest): Promise<GroupResponse> {
    return this.groupService.create(createRequest);
  }

  @Put('/:groupId')
  update(@Param('groupId') groupId: string,
         @Body() updateRequest: GroupRequest): Promise<GroupResponse> {
    return this.groupService.update(updateRequest, groupId);
  }

  @Delete('/:groupId')
  deleteGroup(@Param('groupId') groupId: string): Promise<void> {
    return this.groupService.delete(groupId);
  }

  @Post('/:groupId/join')
  join(@Param('groupId') groupId: string): Promise<JoinStatusResponse> {
    return this.groupService.join(groupId);
  }

  @Post('/:groupId/leave')
  leave(@Param('groupId') groupId: string): Promise<JoinStatusResponse> {
    return this.groupService.leave(groupId);
  }

  @Post('/:groupId/join-request/accept/:userId')
  acceptJoinRequest(@Param('groupId') groupId: string,
                    @Param('userId') userId: string) {
    return this.groupService.acceptJoinRequest(groupId, userId);
  }

  @Post('/:groupId/join-request/decline/:userId')
  declineJoinRequest(@Param('groupId') groupId: string,
                     @Param('userId') userId: string) {
    return this.groupService.declineJoinRequest(groupId, userId);
  }

  @Post('/:groupId/ban/:userId')
  banUser(@Param('groupId') groupId: string,
          @Param('userId') userId: string): Promise<void> {
    return this.groupService.banUser(groupId, userId);
  }

  @Post('/:groupId/allow/:userId')
  allowUser(@Param('groupId') groupId: string,
            @Param('userId') userId: string): Promise<void> {
    return this.groupService.allowUser(groupId, userId);
  }
}
