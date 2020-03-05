import {Group} from "./group.schema";
import {GroupResponse} from "../../dtos/group/group-response";

export class GroupMapper {
  static modelsToResponse(models: Group[]): GroupResponse[] {
    return models.map(GroupMapper.modelToResponse);
  }

  static modelToResponse(model: Group): GroupResponse {
    const response = new GroupResponse();

    response.id = model._id;
    response.name = model.name;
    response.joinPolicy = model.joinPolicy;
    response.owner = model.owner as string;
    response.description = model.description;

    return response;
  }
}
