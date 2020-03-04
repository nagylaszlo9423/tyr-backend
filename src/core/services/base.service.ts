import {NotFoundException} from "../../errors/errors";
import {Document, DocumentQuery, Model, Query} from "mongoose";
import {Auditable, AuditManager} from "../util/auditable";
import {PaginationOptions} from "../util/pagination/pagination-options";
import {Page} from "../util/pagination/page";


export abstract class BaseService<T extends Document> {

  protected constructor(protected model: Model<T>) {
  }

  public async _removeById(id: string): Promise<void> {
    await this.model.remove({_id: id}).exec();
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

  public _findPage(options: PaginationOptions, conditions?: any, queryCallback?: (query: DocumentQuery<Page<T>, T>) => DocumentQuery<Page<T>, T>): Promise<Page<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const total = await this.model.countDocuments({}).exec();

        let query = this.model
          .find(conditions)
          .skip(options.skip())
          .limit(options.size)
          .map(results => new Page({
            page: options.page,
            size: options.size,
            total: total,
            items: results
          }));

        if (queryCallback) {
          query = queryCallback(query);
        }

        resolve(await query.exec());
      } catch (e) {
        reject(e);
      }
    });

  }
}
