import {GeojsonMapper} from "../../core/util/geojson.mapper";
import {AuditMapper} from "../../core/util/audit.mapper";
import {ResourceMapper} from "../resource/resource.mapper";
import {ResourceItem} from "../resource/resource-item.schema";
import {PathResponse} from "../../dtos/path/path-response";
import {CreatePathRequest} from "../../dtos/path/create-path.request";
import {Path} from "./path.schema";
import {UpdatePathRequest} from "../../dtos/path/update-path.request";

export class PathMapper {
  static modelsToResponses(entities: Path[], owner: string): PathResponse[] {
    return entities.map(entity => PathMapper.modelToResponse(entity, owner));
  }

  static modelToResponse(entity: Path, owner: string): PathResponse {
    const result = new PathResponse();

    result.id = entity._id;
    result.title = entity.title;
    result.description = entity.description;
    result.path = GeojsonMapper.lineStringModelToResponse(entity.path);
    result.audit = AuditMapper.modelToResponse(entity.audit);
    result.images = ResourceMapper.modelsToResponse(entity.images as ResourceItem[]);
    result.isEditable = owner === entity.owner.toString();

    return result;
  }

  static createRequestToModel(request: CreatePathRequest, model: Path) {
    model.title = request.title;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);
  }

  static updateRequestToModel(request: UpdatePathRequest, model: Path) {
    model.title = request.title;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);;
  }
}
