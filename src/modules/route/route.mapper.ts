import {RouteResponse} from "../../api/route/route.response";
import {RouteRequest} from "../../api/route/route.request";
import {Route} from "./route.schema";

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
}
