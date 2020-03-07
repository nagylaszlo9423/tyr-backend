import {Group} from "./group.schema";
import {GroupResponse} from "../../dtos/group/group-response";
import {AuditMapper} from "../../core/util/audit.mapper";

export class GroupMapper {
  static modelsToResponse(models: Group[], isEditable: (group: Group) => boolean): GroupResponse[] {
    return models.map(group => GroupMapper.modelToResponse(group, isEditable(group)));
  }

  static modelToResponse(model: Group, isEditable: boolean): GroupResponse {
    const response = new GroupResponse();

    response.id = model._id;
    response.name = model.name;
    response.joinPolicy = model.joinPolicy;
    response.owner = model.owner as string;
    response.description = model.description;
    response.isEditable = isEditable;
    response.audit = AuditMapper.modelToResponse(model.audit);

    return response;
  }
}
