import {RouteResponse} from "../../api/route/route.response";
import {Route} from "./route.schema";
import {CreateRouteRequest} from "../../api/route/create-route.request";
import {RouteRequest} from "../../api/route/route.request";
import {UpdateRouteRequest} from "../../api/route/update-route.request";

export class RouteMapper {
  static modelToResponse(entity: Route): RouteResponse {
    const result = new RouteResponse();

    result.title = entity.title;
    result.description = entity.description;
    result.path = entity.path;
    result.audit = entity.audit;

    return result;
  }

  static requestToModel(request: RouteRequest, model: Route) {
    model.title = request.title;
    model.description = request.description;
    model.path = request.path;
  }

  static createRequestToModel(request: CreateRouteRequest, model: Route) {
    RouteMapper.requestToModel(request, model);
    model.visibility = request.visibility;
  }

  static updateRequestToModel(request: UpdateRouteRequest, model: Route) {
    RouteMapper.requestToModel(request, model);
  }
}
