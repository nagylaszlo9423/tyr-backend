import {GroupDoc} from './group.schema';
import {GroupResponse} from '../../dtos/group/group-response';
import {AuditMapper} from '../../core/util/audit.mapper';
import {getDocumentId} from '../../core/util/db.helper';

export class GroupMapper {
  static modelsToResponse(models: GroupDoc[], isEditable: (group: GroupDoc) => boolean, isMember: (group: GroupDoc) => boolean): GroupResponse[] {
    return models.map(group => GroupMapper.modelToResponse(group, isEditable, isMember));
  }

  static modelToResponse(model: GroupDoc, isEditable: (group: GroupDoc) => boolean, isMember: (group: GroupDoc) => boolean): GroupResponse {
    const response = new GroupResponse();

    response.id = model._id;
    response.name = model.name;
    response.joinPolicy = model.joinPolicy;
    response.owner = getDocumentId(model.owner);
    response.description = model.description;
    response.isEditable = isEditable(model);
    response.isMember = isMember(model);
    response.audit = AuditMapper.modelToResponse(model.audit);

    return response;
  }
}
