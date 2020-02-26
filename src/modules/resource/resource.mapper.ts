import {ResourceItem} from "./resource-item.schema";
import {ResourceItemResponse} from "../../core/dto/resource-item.response";


export class ResourceMapper {
  static modelsToResponse(model: ResourceItem[]): ResourceItemResponse[] {
    return model.map(this.modelToResponse);
  }

  static modelToResponse(model: ResourceItem): ResourceItemResponse {
    return {
      id: model._id,
      name: model.name,
      url: model.url
    };
  }
}
