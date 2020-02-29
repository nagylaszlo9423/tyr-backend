import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {RouteService} from "./route.service";
import {CreatedResponse} from "../../core/dto/created.response";
import {CreateRouteRequest} from "../../dtos/route/create-route.request";
import {UpdateRouteRequest} from "../../dtos/route/update-route.request";
import {RouteResponse} from "../../dtos/route/route.response";

@Controller('/route')
export class RouteController {

  constructor(private routeService: RouteService) {
  }

  @Post()
  async create(@Body() request: CreateRouteRequest): Promise<CreatedResponse> {
    return this.routeService.create(request);
  }

  @Put('/:id')
  async update(@Body() request: UpdateRouteRequest,
               @Param('id') routeId: string): Promise<void> {
    return this.routeService.update(request, routeId);
  }

  @Delete('/:id')
  async delete(@Param() routeId: string): Promise<void> {
    return this.routeService.deleteById(routeId);
  }

  @Get('/list')
  findAllAvailable(): Promise<RouteResponse[]> {
    return this.routeService.findAllAvailable();
  }

  @Get('/list/:filter')
  findByFilter(@Param() filter: string): Promise<RouteResponse[]> {
    switch (filter) {
      case 'most-popular': return Promise.resolve([]);
      case 'near': return Promise.resolve([]);
      case 'own':
      default: return this.routeService.findAllByCurrentUser();
    }
  }

  @Get('/:id')
  async findById(@Param() routeId: string): Promise<RouteResponse> {
    return this.routeService.findById(routeId);
  }

  @Post('/:routeId/share-in-group/:groupId')
  async shareInGroup(@Param('routeId') routeId: string,
                     @Param('groupId') groupId: string): Promise<void> {
    return this.routeService.shareInGroup(routeId, groupId);
  }

  @Post('/:id')
  async publish(@Param('id') routeId: string): Promise<void> {
    return this.routeService.publish(routeId);
  }
}
