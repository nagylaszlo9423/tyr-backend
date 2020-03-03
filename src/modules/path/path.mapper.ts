import {GeojsonMapper} from "../../core/util/geojson.mapper";
import {AuditMapper} from "../../core/util/audit.mapper";
import {ResourceMapper} from "../resource/resource.mapper";
import {ResourceItem} from "../resource/resource-item.schema";
import {PathResponse} from "../../dtos/path/path-response";
import {Path} from "./path.schema";
import {Page} from "../../core/util/pagination/page";
import {PageResponse} from "../../core/dto/page.response";
import {mapResultsToPageResponse} from "../../core/util/pagination/pagination-mapper";
import {PathRequest} from "../../dtos/path/path.request";

export class PathMapper {

  static modelsPageToResponse(page: Page<Path>, owner: string): PageResponse<PathResponse> {
    return mapResultsToPageResponse(page, items => this.modelsToResponses(items, owner))
  }

  static modelsToResponses(entities: Path[], owner: string): PathResponse[] {
    return entities.map(entity => PathMapper.modelToResponse(entity, owner));
  }

  static modelToResponse(entity: Path, owner: string): PathResponse {
    const result = new PathResponse();

    result.id = entity._id.toString();
    result.title = entity.title;
    result.description = entity.description;
    result.path = GeojsonMapper.lineStringModelToResponse(entity.path);
    result.audit = AuditMapper.modelToResponse(entity.audit);
    result.images = ResourceMapper.modelsToResponse(entity.images as ResourceItem[]);
    result.isEditable = owner === entity.owner.toString();
    result.visibility = entity.visibility;

    return result;
  }

  static requestToModel(request: PathRequest, model: Path) {
    model.title = request.title;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);
  }
}
