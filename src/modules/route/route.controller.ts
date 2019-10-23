import {Body, Controller, Header, Headers, Param, Post, Put} from "@nestjs/common";
import {RouteService} from "./route.service";
import {UpdateRouteRequest} from "../../api/route/update-route.request";
import {CreateRouteRequest} from "../../api/route/create-route.request";


@Controller('route')
export class RouteController {

  constructor(private routeService: RouteService) {
  }

  @Post()
  async create(@Body() request: CreateRouteRequest, @Headers('User-Id') userId: string): Promise<string> {
    return this.routeService.create(request, userId);
  }

  @Put(':id')
  async update(@Body() request: UpdateRouteRequest,
               @Param() routeId: string,
               @Headers('User-Id') userId: string): Promise<void> {
    return this.routeService.update(request, routeId, userId);
  }

  async delete(@Param() routeId: string, @Headers('User-Id') userId: string) {

  }

}
