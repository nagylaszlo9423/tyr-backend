import {ResourceItemResponse} from "tyr-api";
import {ResourceItem} from "./resource-item.schema";


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
