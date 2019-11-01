import {Body, Controller, Delete, Get, Header, Headers, Param, Post, Put} from "@nestjs/common";
import {RouteService} from "./route.service";
import {UpdateRouteRequest} from "../../api/route/update-route.request";
import {CreateRouteRequest} from "../../api/route/create-route.request";
import {RouteResponse} from "../../api/route/route.response";


@Controller('route')
export class RouteController {

  constructor(private routeService: RouteService) {
  }

  @Post()
  async create(@Body() request: CreateRouteRequest): Promise<string> {
    return this.routeService.create(request);
  }

  @Put(':id')
  async update(@Body() request: UpdateRouteRequest,
               @Param('id') routeId: string): Promise<void> {
    return this.routeService.update(request, routeId);
  }

  @Delete(':id')
  async delete(@Param() routeId: string): Promise<void> {
    return this.routeService.deleteById(routeId);
  }

  @Get('most-popular')
  async findMostPopularInTheArea(): Promise<RouteResponse[]> {
    return Promise.resolve([]);
  }

  @Get(':id')
  async findById(@Param() routeId: string): Promise<RouteResponse> {
    return this.routeService.findById(routeId);
  }

  @Post(':routeId/share-in-group/:groupId')
  async shareInGroup(@Param('routeId') routeId: string,
                     @Param('groupId') groupId: string): Promise<void> {
    return this.routeService.shareInGroup(routeId, groupId);
  }

  @Post(':routeId')
  async publish(@Param('routeId') routeId: string): Promise<void> {
    return this.routeService.publish(routeId);
  }
}
