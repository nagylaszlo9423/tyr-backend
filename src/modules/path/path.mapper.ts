import {GeojsonMapper} from '../../core/util/geojson.mapper';
import {AuditMapper} from '../../core/util/audit.mapper';
import {ResourceMapper} from '../resource/resource.mapper';
import {ResourceItem} from '../resource/resource-item.schema';
import {Path} from './path.schema';
import {Page} from '../../core/util/pagination/page';
import {PageResponse} from '../../dtos/page.response';
import {mapResultsToPageResponse} from '../../core/util/pagination/pagination-mapper';
import {PathRequest} from '../../dtos/path/path.request';
import {PathResponse} from '../../dtos/path/path.response';

export class PathMapper {

  static modelsPageToResponse(page: Page<Path>, owner: string): PageResponse<PathResponse> {
    return mapResultsToPageResponse(page, items => this.modelToResponse(items, owner));
  }

  static modelToResponse(entity: Path, owner: string): PathResponse {
    const result = new PathResponse();

    result.id = entity._id.toString();
    result.name = entity.name;
    result.description = entity.description;
    result.path = GeojsonMapper.lineStringModelToResponse(entity.path);
    result.audit = AuditMapper.modelToResponse(entity.audit);
    result.images = ResourceMapper.modelsToResponse(entity.images as ResourceItem[]);
    result.isEditable = owner === entity.owner.toString();
    result.visibility = entity.visibility;

    return result;
  }

  static requestToModel(request: PathRequest, model: Path) {
    model.name = request.name;
    model.description = request.description;
    GeojsonMapper.lineStringRequestToModel(request.path, model.path);
  }
}
