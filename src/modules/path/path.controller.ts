import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from "@nestjs/common";
import {CreatedResponse} from "../../core/dto/created.response";
import {PathService} from "./path.service";
import {PathResponse} from "../../dtos/path/path-response";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";
import {PageResponse} from "../../core/dto/page.response";
import {PathRequest} from "../../dtos/path/path.request";
import {ArrayQueryPipe} from "../../core/pipes/array-query.pipe";

@Controller('/path')
export class PathController {

  constructor(private pathService: PathService) {
  }

  @Post()
  async create(@Body() request: PathRequest): Promise<CreatedResponse> {
    return this.pathService.create(request);
  }

  @Post('/list/area')
  findByArea() {

  }

  @Post('/:pathId/share-in-group/:groupId')
  async shareInGroup(@Param('pathId') pathId: string,
                     @Param('groupId') groupId: string): Promise<void> {
    return this.pathService.shareInGroup(pathId, groupId);
  }

  @Post('/:id')
  async publish(@Param('id') pathId: string): Promise<void> {
    return this.pathService.publish(pathId);
  }

  @Put('/:id')
  async update(@Body() request: PathRequest,
               @Param('id') pathId: string): Promise<void> {
    return this.pathService.update(request, pathId);
  }

  @Delete('/:id')
  async delete(@Param('id') pathId: string): Promise<void> {
    return this.pathService.deleteById(pathId);
  }

  @Get('/list')
  findAllAvailableByFilters(@Query('filters', ArrayQueryPipe) filters: string[],
                            @Query('page', ParseIntPipe) page: number,
                            @Query('size', ParseIntPipe) size: number,
                            @Query('search') searchExp: string,
                            @Query('sortBy') sortBy: string): Promise<PageResponse<PathResponse>> {
    return this.pathService.findAllAvailableByFilters(PaginationOptions.of(page, size), filters, sortBy, searchExp);
  }

  @Get('/:id')
  async findById(@Param('id') pathId: string): Promise<PathResponse> {
    return this.pathService.findById(pathId);
  }
}
