import {RouteResponse} from "../../api/route/route.response";
import {Route} from "./route.schema";
import {CreateRouteRequest} from "../../api/route/create-route.request";
import {RouteRequest} from "../../api/route/route.request";
import {UpdateRouteRequest} from "../../api/route/update-route.request";
import {GeojsonMapper} from "../../core/util/geojson.mapper";

export class RouteMapper {
  static modelsToResponses(entities: Route[]): RouteResponse[] {
    return entities.map(entity => RouteMapper.modelToResponse(entity));
  }

  static modelToResponse(entity: Route): RouteResponse {
    const result = new RouteResponse();

    result.title = entity.title;
    result.description = entity.description;
    result.path = GeojsonMapper.lineStringModelToResponse(entity.path);
    result.audit = entity.audit;

    return result;
  }

  static requestToModel(request: RouteRequest, model: Route) {
    model.title = request.title;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);
  }

  static createRequestToModel(request: CreateRouteRequest, model: Route) {
    RouteMapper.requestToModel(request, model);
  }

  static updateRequestToModel(request: UpdateRouteRequest, model: Route) {
    RouteMapper.requestToModel(request, model);
  }
}
