import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {JoinStatusDoc} from './join-status.schema';
import {BaseService} from '../../../core/services/base.service';
import {PaginationOptions} from '../../../core/util/pagination/pagination-options';
import {PageResponse} from '../../../core/dto/page.response';
import {ContextService} from '../../../core/services/context.service';
import {JoinStatus} from './join-status';
import {ObjectId} from '../../../db/mongoose';
import {JoinStatusResponse} from '../../../dtos/group/join-status.response';
import {JoinStatusMapper} from './join-status.mapper';

@Injectable()
export class JoinStatusService extends BaseService<JoinStatusDoc> {

  constructor(@InjectModel('JoinStatus') userModel: Model<JoinStatusDoc>,
              private ctx: ContextService) {
    super(userModel);
  }

  async accept(requestId: string): Promise<void> {
    const request = await this._findById(requestId);
    if (request.status === JoinStatus.PENDING) {
      request.status = JoinStatus.ACCEPTED;
      this._saveAndAudit(request, this.ctx.userId);
    }
  }

  async decline(requestId: string): Promise<void> {
    const request = await this._findById(requestId);
    if (request.status === JoinStatus.PENDING) {
      request.status = JoinStatus.DENIED;
      this._saveAndAudit(request, this.ctx.userId);
    }
  }

  async leave(groupId: string): Promise<JoinStatusResponse> {
    const request = await this._findOne({group: groupId, requester: this.ctx.userId});

    request.status = JoinStatus.LEFT;

    const result = await this._saveAndAudit(request, this.ctx.userId);
    return JoinStatusMapper.modelToResponse(result);
  }

  findRequestsPageForGroup(groupId: string, paginationOptions: PaginationOptions): Promise<PageResponse<JoinStatusDoc>> {
    return this._findPage(paginationOptions, {status: JoinStatus.PENDING, group: groupId},
      query => query.populate('requester'));
  }

  findRequestsPageForUser(paginationOptions: PaginationOptions) {
    return this._findPage(paginationOptions, {
      requester: this.ctx.userId,
      $or: [
        {status: JoinStatus.PENDING},
        {status: JoinStatus.DENIED}
      ]
    });
  }

  async createRequest(groupId: string, status?: JoinStatus): Promise<JoinStatusResponse> {
    const doc = new this.model({
      group: ObjectId(groupId),
      requester: ObjectId(this.ctx.userId),
      status: status || JoinStatus.PENDING,
    } as JoinStatusDoc);

    const result = await this._saveAndAudit(doc, this.ctx.userId);
    return JoinStatusMapper.modelToResponse(result);
  }
}
