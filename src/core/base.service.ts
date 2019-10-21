import {Route} from "../modules/route/route.schema";
import {NotFoundException} from "../api/errors/errors";
import {Document, Model} from "mongoose";
import {IAuditable} from "./schemas/auditable.schema";


export abstract class BaseService<T extends Document> {

  public constructor(protected model: Model<T>) {
  }

  public async removeById(id: string): Promise<void> {
    const model = await this.fetchById(id);
    await model.remove();
  }

  public async fetchById(id: string): Promise<T> {
    const model = await this.model.findById(id).exec();
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  public async saveAndAudit(model: T & IAuditable, userId: string): Promise<T> {
    model._userId = userId;
    return model.save();
  }
}
