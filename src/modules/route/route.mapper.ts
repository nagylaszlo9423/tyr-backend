import {Route} from "./route.schema";
import {GeojsonMapper} from "../../core/util/geojson.mapper";
import {CreateRouteRequest, RouteResponse, UpdateRouteRequest} from "tyr-api";
import {AuditMapper} from "../../core/util/audit.mapper";
import {ResourceMapper} from "../resource/resource.mapper";
import {ResourceItem} from "../resource/resource-item.schema";

export class RouteMapper {
  static modelsToResponses(entities: Route[]): RouteResponse[] {
    return entities.map(entity => RouteMapper.modelToResponse(entity));
  }

  static modelToResponse(entity: Route): RouteResponse {
    const result = new RouteResponse();

    result.title = entity.title;
    result.description = entity.description;
    result.path = GeojsonMapper.lineStringModelToResponse(entity.path);
    result.audit = AuditMapper.modelToResponse(entity.audit);
    result.images = ResourceMapper.modelsToResponse(entity.images as ResourceItem[]);

    return result;
  }

  static createRequestToModel(request: CreateRouteRequest, model: Route) {
    model.title = request.title;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);
  }

  static updateRequestToModel(request: UpdateRouteRequest, model: Route) {
    model.title = request.title;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);;
  }
}
