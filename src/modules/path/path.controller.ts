import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, ValidationPipe} from '@nestjs/common';
import {CreatedResponse} from '../../dtos/created.response';
import {PathService} from './path.service';
import {PaginationOptions} from '../../core/util/pagination/pagination-options';
import {PageResponse} from '../../dtos/page.response';
import {PathRequest} from '../../dtos/path/path.request';
import {PathResponse} from '../../dtos/path/path.response';
import {ParseIntArrayPipe} from '../../core/pipes/parse-int-array.pipe';
import {FindPathsInAreaRequest} from '../../dtos/path/find-paths-in-area.request';

@Controller('/path')
export class PathController {

  constructor(private pathService: PathService) {
  }

  @Post('/area')
  findAllAvailableByArea(@Body(ValidationPipe) body: FindPathsInAreaRequest): Promise<PathResponse[]> {
    return this.pathService.findAllAvailableByArea(body);
  }

  @Post()
  async create(@Body() request: PathRequest): Promise<CreatedResponse> {
    return this.pathService.create(request);
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

  @Get('/page')
  findAllAvailableByFilters(@Query('filters', ParseIntArrayPipe) filters: number[],
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
