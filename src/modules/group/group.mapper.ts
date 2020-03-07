import {Group} from "./group.schema";
import {GroupResponse} from "../../dtos/group/group-response";
import {AuditMapper} from "../../core/util/audit.mapper";
import {getDocumentId} from "../../core/util/db.helper";

export class GroupMapper {
  static modelsToResponse(models: Group[], isEditable: (group: Group) => boolean, isJoinEnabled: (group: Group) => boolean): GroupResponse[] {
    return models.map(group => GroupMapper.modelToResponse(group, isEditable, isJoinEnabled));
  }

  static modelToResponse(model: Group, isEditable: (group: Group) => boolean, isJoinEnabled: (group: Group) => boolean): GroupResponse {
    const response = new GroupResponse();

    response.id = model._id;
    response.name = model.name;
    response.joinPolicy = model.joinPolicy;
    response.owner = getDocumentId(model.owner);
    response.description = model.description;
    response.isEditable = isEditable(model);
    response.isJoinEnabled = isJoinEnabled(model);
    response.audit = AuditMapper.modelToResponse(model.audit);

    return response;
  }
}
