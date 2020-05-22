import {NotFoundException} from '../errors/exceptions';
import {Document, DocumentQuery, FilterQuery, Model} from 'mongoose';
import {Auditable, AuditManager} from '../util/auditable';
import {PaginationOptions} from '../util/pagination/pagination-options';
import {Page} from '../util/pagination/page';
import {DeletionResult} from '../../dtos/deletion.result';
import {DeleteWriteOpResultObject} from 'mongodb';

export type QueryCallback<E extends Document, T = E> = (query: DocumentQuery<T, E>) => DocumentQuery<T, E>;

export abstract class BaseService<T extends Document> {

  protected constructor(protected model: Model<T>) {}

  public _remove(conditions?: FilterQuery<T>): Promise<DeletionResult> {
    return this.model.remove(conditions).exec().then(BaseService.toDeletionResult);
  }

  public async _removeById(id: string): Promise<void> {
    await this.model.remove({_id: id} as any).exec();
  }

  public _findById(id: string, conditions?: any, queryCallback?: QueryCallback<T>): Promise<T> {
    return this._findOneOrNotFound({_id: id, ...conditions}, queryCallback);
  }

  public async _findOneOrNotFound(conditions?: any, queryCallback?: QueryCallback<T>): Promise<T | null> {
    const doc = this._findOne(conditions, queryCallback);

    if (!doc) {
      throw new NotFoundException();
    }

    return doc;
  }

  public async _findOne(conditions?: any, queryCallback?: QueryCallback<T>): Promise<T | null> {
    return await BaseService.callQueryCallback(this.model.findOne(conditions), queryCallback).exec();
  }

  public async _saveAndAudit(model: T & Auditable, userId: string): Promise<T> {
    if (model.audit && model.audit.createdAt && model.audit.createdBy) {
      AuditManager.modifyAudit(model.audit, userId);
    } else {
      model.audit = AuditManager.createAudit(userId);
    }
    return model.save();
  }

  public _find(conditions?: any, queryCallback?: QueryCallback<T, T[]>): Promise<T[]> {
      return BaseService.callQueryCallback(this.model.find(conditions), queryCallback).exec();
  }

  public _findPage(options: PaginationOptions, conditions?: any, queryCallback?: QueryCallback<T, Page<T>>): Promise<Page<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const total = await this.model.countDocuments({}).exec();

        const query = this.model
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
