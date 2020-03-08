import {Injectable} from '@nestjs/common';
import {BaseService} from '../../core/services/base.service';
import {Group} from './group.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ContextService} from '../../core/services/context.service';
import {ForbiddenException} from '../../core/errors/errors';
import {mapResultsToPageResponse} from '../../core/util/pagination/pagination-mapper';
import {PaginationOptions} from '../../core/util/pagination/pagination-options';
import {GroupResponse} from '../../dtos/group/group-response';
import {PageResponse} from '../../core/dto/page.response';
import {GroupRequest} from '../../dtos/group/group.request';
import {GroupMapper} from './group.mapper';
import {GroupQueries} from './group.queries';
import {GroupFilter} from './enums/group-filter';
import {ObjectId} from '../../db/mongoose';
import {getDocumentId} from '../../core/util/db.helper';
import {GroupJoinPolicy} from './enums/group-join-policy';

@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>,
              private ctx: ContextService) {
    super(model);
  }

  findById(id: string): Promise<GroupResponse> {
    return this._findById(id).then(_ => GroupMapper.modelToResponse(_, this.isEditable.bind(this), this.isMember.bind(this)));
  }

  async findAllGroupsByPage(options: PaginationOptions, filters: GroupFilter[], searchExp: string, sortBy: string): Promise<PageResponse<GroupResponse>> {
    return mapResultsToPageResponse(await this._findPage(
      options,
      GroupQueries.queryAllByFilters(this.ctx.userId, filters, searchExp),
      GroupQueries.sortByFilters.bind(this, sortBy),
    ), items => GroupMapper.modelsToResponse(items, this.isEditable.bind(this), this.isMember.bind(this)));
  }

  async join(groupId: string) {
    const group = await this._findById(groupId);
    if (group.members.findIndex(userId => this.ctx.userId === getDocumentId(userId)) > -1) {
      return;
    }
    group.members.push(ObjectId(this.ctx.userId));
    await group.save();
  }

  async leave(groupId: string) {
    const group = await this._findById(groupId);
    if (group.members.map(getDocumentId).findIndex(userId => this.ctx.userId === userId) === -1) {
      return;
    }
    group.members = group.members.filter(userId => userId.toString() !== this.ctx.userId);
    await group.save();
  }

  async create(createRequest: GroupRequest): Promise<GroupResponse> {
    const group = this.createRequestToModel(createRequest, this.ctx.userId);
    await this._saveAndAudit(group, this.ctx.userId);
    return GroupMapper.modelToResponse(group, this.isEditable.bind(this), this.isMember.bind(this));
  }

  async update(updateRequest: GroupRequest, groupId: string): Promise<GroupResponse> {
    let group = await this._findById(groupId);
    this.updateRequestToModel(updateRequest, group);
    group = await this._saveAndAudit(group, this.ctx.userId);
    return GroupMapper.modelToResponse(group, this.isEditable.bind(this), this.isMember.bind(this));
  }

  async delete(groupId) {
    const group = await this._findById(groupId);
    if (group.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    await group.remove();
  }

  private isEditable(group: Group): boolean {
    return getDocumentId(group.owner) === this.ctx.userId;
  }

  private isMember(group: Group): boolean {
    return getDocumentId(group.owner) === this.ctx.userId ||
      group.members.map(getDocumentId).indexOf(this.ctx.userId) > -1;
  }

  private createRequestToModel(request: GroupRequest, owner: string): Group {
    return new this.model({
      name: request.name,
      joinPolicy: request.joinPolicy,
      description: request.description,
      owner: ObjectId(owner),
      members: [],
      paths: [],
    } as Group);
  }

  private updateRequestToModel(request: GroupRequest, model: Group) {
    model.name = request.name;
    model.description = request.description;
    model.joinPolicy = request.joinPolicy;
  }
}
