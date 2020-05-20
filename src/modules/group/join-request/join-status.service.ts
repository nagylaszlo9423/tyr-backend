import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {JoinStatusDoc} from './join-status.schema';
import {BaseService} from '../../../core/services/base.service';
import {PaginationOptions} from '../../../core/util/pagination/pagination-options';
import {ContextService} from '../../../core/services/context.service';
import {JoinStatus} from '../enums/join-status';
import {ObjectId} from '../../../db/mongoose';
import {JoinStatusResponse} from '../../../dtos/group/join-status.response';
import {JoinStatusMapper} from './join-status.mapper';
import {GeneralException} from '../../../core/errors/errors';
import {GroupCause} from '../../../core/errors/cause/group.cause';
import {Page} from '../../../core/util/pagination/page';

@Injectable()
export class JoinStatusService extends BaseService<JoinStatusDoc> {

  constructor(@InjectModel('JoinStatus') userModel: Model<JoinStatusDoc>,
              private ctx: ContextService) {
    super(userModel);
  }

  async accept(groupId: string, userId: string): Promise<void> {
    const request = await this._findOneOrNotFound({group: groupId, user: userId});
    if (request.status === JoinStatus.PENDING) {
      request.status = JoinStatus.ACCEPTED;
      this._saveAndAudit(request, this.ctx.userId);
    }
  }

  async decline(groupId: string, userId: string): Promise<void> {
    const request = await this._findOneOrNotFound({group: groupId, user: userId});
    if (request.status === JoinStatus.PENDING) {
      request.status = JoinStatus.DENIED;
      this._saveAndAudit(request, this.ctx.userId);
    }
  }

  async leave(groupId: string): Promise<JoinStatusResponse> {
    const request = await this._findOne({group: groupId, user: this.ctx.userId});

    request.status = JoinStatus.LEFT;

    const result = await this._saveAndAudit(request, this.ctx.userId);
    return JoinStatusMapper.modelToResponse(result);
  }

  findRequestsPageForGroup(groupId: string, paginationOptions: PaginationOptions): Promise<Page<JoinStatusDoc>> {
    return this._findPage(paginationOptions, {status: JoinStatus.PENDING, group: groupId},
      query => query.populate('user'));
  }

  findRequestsPageForUser(paginationOptions: PaginationOptions): Promise<Page<JoinStatusDoc>> {
    return this._findPage(paginationOptions, {
      user: this.ctx.userId,
      $or: [
        {status: JoinStatus.PENDING},
        {status: JoinStatus.DENIED}
      ]
    });
  }

  async banUser(groupId: string, userId: string): Promise<void> {
    const joinStatusDoc = await this._findOne({group: groupId, user: userId});

    if (joinStatusDoc) {
      joinStatusDoc.status = JoinStatus.BANNED;
      this._saveAndAudit(joinStatusDoc, this.ctx.userId);
    } else {
      await this.createJoinStatus(groupId, userId, JoinStatus.BANNED);
    }
  }

  async allowUser(groupId: string, userId: string): Promise<void> {
    const joinStatusDoc = await this._findOne({group: groupId, user: userId});

    if (joinStatusDoc) {
      joinStatusDoc.status = JoinStatus.LEFT;
      this._saveAndAudit(joinStatusDoc, this.ctx.userId);
    }
  }

  async createJoinStatus(groupId: string, userId: string, status?: JoinStatus): Promise<JoinStatusResponse> {
    await this.checkIfUserCanJoinGroup(groupId, userId);

    const doc = new this.model({
      group: ObjectId(groupId),
      user: ObjectId(userId),
      status: status || JoinStatus.PENDING,
    } as JoinStatusDoc);

    const result = await this._saveAndAudit(doc, userId);
    return JoinStatusMapper.modelToResponse(result);
  }

  private async checkIfUserCanJoinGroup(groupId: string, userId: string) {
    const joinStatusDoc = await this.model.findOne({group: groupId, user: userId});

    if (joinStatusDoc) {
      switch (joinStatusDoc.status) {
        case JoinStatus.ACCEPTED:
          throw new GeneralException(GroupCause.ALREADY_MEMBER_OF_GROUP);
        case JoinStatus.BANNED:
          throw new GeneralException(GroupCause.BANNED_USER);
        case JoinStatus.PENDING:
          throw new GeneralException(GroupCause.JOIN_REQUEST_PENDING);
      }
    }
  }
}
