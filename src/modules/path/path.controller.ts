import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreatedResponse} from "../../core/dto/created.response";
import {CreatePathRequest} from "../../dtos/path/create-path.request";
import {PathService} from "./path.service";
import {UpdatePathRequest} from "../../dtos/path/update-path.request";
import {PathResponse} from "../../dtos/path/path-response";

@Controller('/path')
export class PathController {

  constructor(private pathService: PathService) {
  }

  @Post()
  async create(@Body() request: CreatePathRequest): Promise<CreatedResponse> {
    return this.pathService.create(request);
  }

  @Put('/:id')
  async update(@Body() request: UpdatePathRequest,
               @Param('id') pathId: string): Promise<void> {
    return this.pathService.update(request, pathId);
  }

  @Delete('/:id')
  async delete(@Param() pathId: string): Promise<void> {
    return this.pathService.deleteById(pathId);
  }

  @Get('/list')
  findAllAvailable(): Promise<PathResponse[]> {
    return this.pathService.findAllAvailable();
  }

  @Get('/list/:filter')
  findByFilter(@Param('filter') filter: string): Promise<PathResponse[]> {
    switch (filter) {
      case 'most-popular': return Promise.resolve([]);
      case 'near': return Promise.resolve([]);
      case 'own':
      default: return this.pathService.findAllByCurrentUser();
    }
  }

  @Get('/:id')
  async findById(@Param('id') pathId: string): Promise<PathResponse> {
    return this.pathService.findById(pathId);
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
}
