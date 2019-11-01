import {NotFoundException} from "../../api/errors/errors";
import {Document, Model} from "mongoose";
import {Auditable, AuditManager} from "../util/auditable";


export abstract class BaseService<T extends Document> {

  public constructor(protected model: Model<T>) {
  }

  public async _removeById(id: string): Promise<void> {
    const model = await this._fetchById(id);
    await model.remove();
  }

  public async _fetchById(id: string): Promise<T> {
    const model = await this.model.findById(id).exec();
    if (!model) {
      throw new NotFoundException();
    }
    return model;
  }

  public async _saveAndAudit(model: T & Auditable, userId: string): Promise<T> {
    if (model.audit && model.audit.createdAt && model.audit.createdBy) {
      AuditManager.modifyAudit(model.audit, userId);
    } else {
      model.audit = AuditManager.createAudit(userId);
    }
    return model.save();
  }
}
