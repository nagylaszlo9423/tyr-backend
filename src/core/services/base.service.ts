import {NotFoundException} from "../errors/errors";
import {Document, DocumentQuery, Model, Query} from "mongoose";
import {Auditable, AuditManager} from "../util/auditable";
import {PaginationOptions} from "../util/pagination/pagination-options";
import {Page} from "../util/pagination/page";
import {DeletionResult} from "../dto/deletion.result";
import {DeleteWriteOpResultObject} from 'mongodb';

export type QueryCallback<E extends Document, T = E> = (query: DocumentQuery<T, E>) => DocumentQuery<T, E>;

export abstract class BaseService<T extends Document> {

  protected constructor(protected model: Model<T>) {
  }

  public _remove(conditions?: any): Promise<DeletionResult> {
    return this.model.remove(conditions).exec().then(BaseService.toDeletionResult);
  }

  public async _removeById(id: string): Promise<void> {
    await this.model.remove({_id: id}).exec();
  }

  public async _findById(id: string, conditions?: any, queryCallback?: QueryCallback<T>): Promise<T> {
    const model = await BaseService.callQueryCallback(this.model.findOne({_id: id, ...conditions}), queryCallback).exec();

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

  public _find(conditions?: any, queryCallback?: QueryCallback<T, Array<T>>): Promise<Array<T>> {
      return BaseService.callQueryCallback(this.model.find(conditions), queryCallback).exec();
  }

  public _findPage(options: PaginationOptions, conditions?: any, queryCallback?: QueryCallback<T, Page<T>>): Promise<Page<T>> {
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

        resolve(await BaseService.callQueryCallback(query, queryCallback).exec());
      } catch (e) {
        reject(e);
      }
    });
  }

  private static callQueryCallback<E extends Document, R = E>(query: DocumentQuery<R, E>, callback: QueryCallback<E, R>): DocumentQuery<R, E> {
    return callback ? callback(query) : query;
  }

  private static toDeletionResult(result: DeleteWriteOpResultObject['result']): DeletionResult {
      return new DeletionResult({ok: result.ok === 1, count: result.n});
  }
}
