import {Injectable} from '@nestjs/common';
import {BaseService} from '../../core/services/base.service';
import {GroupDoc} from './group.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ContextService} from '../../core/services/context.service';
import {ForbiddenException, GeneralException} from '../../core/errors/errors';
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
import {JoinStatusService} from './join-request/join-status.service';
import {JoinStatus} from './enums/join-status';
import {GroupJoinPolicy} from './enums/group-join-policy';
import {GroupCause} from '../../core/errors/cause/group.cause';
import {JoinStatusResponse} from '../../dtos/group/join-status.response';
import {JoinStatusMapper} from './join-request/join-status.mapper';
import {GroupMemberResponse} from '../../dtos/user/group-member.response';
import {UserMapper} from '../user/user.mapper';
import {UserService} from '../user/user.service';

@Injectable()
export class GroupService extends BaseService<GroupDoc> {
  constructor(@InjectModel('Group') model: Model<GroupDoc>,
              private ctx: ContextService,
              private joinRequestService: JoinStatusService,
              private userService: UserService) {
    super(model);
  }

  findById(id: string): Promise<GroupResponse> {
    return this._findById(id).then(_ => GroupMapper.modelToResponse(_,
      group => this.isEditable(group),
      group => this.isMember(group))
    );
  }

  async findAllGroupsByPage(options: PaginationOptions, filters: GroupFilter[], searchExp: string, sortBy: string): Promise<PageResponse<GroupResponse>> {
    return mapResultsToPageResponse(await this._findPage(
      options,
      GroupQueries.queryAllByFilters(this.ctx.userId, filters, searchExp),
      query => GroupQueries.sortByFilters(sortBy, query),
      ), items => GroupMapper.modelToResponse(items,
      _ => this.isEditable(_),
      _ => this.isMember(_))
    );
  }

  async findRequestsPageForGroup(groupId: string, paginationOptions: PaginationOptions): Promise<PageResponse<JoinStatusResponse>> {
    return mapResultsToPageResponse(await this.joinRequestService.findRequestsPageForGroup(groupId, paginationOptions), JoinStatusMapper.modelToResponse);
  }

  async findRequestsPageForUser(paginationOptions: PaginationOptions): Promise<PageResponse<JoinStatusResponse>> {
    return mapResultsToPageResponse(await this.joinRequestService.findRequestsPageForUser(paginationOptions), JoinStatusMapper.modelToResponse);
  }

  async findMembersByGroup(groupId: string, paginationOptions: PaginationOptions): Promise<PageResponse<GroupMemberResponse>> {
    const group = await this._findById(groupId);
    this.checkIfOwner(group);

    const results = await this.userService._findPage(paginationOptions, {
      groups: {$elemMatch: {$eq: groupId}},
    });
    return mapResultsToPageResponse(results, UserMapper.modelToGroupMemberResponse);
  }

  async join(groupId: string): Promise<JoinStatusResponse> {
    const group = await this._findById(groupId);

    if (this.isMember(group)) {
      throw new GeneralException(GroupCause.ALREADY_MEMBER_OF_GROUP);
    }

    if (group.joinPolicy === GroupJoinPolicy.CLOSED) {
      throw new GeneralException(GroupCause.JOIN_IS_NOT_PERMITTED);
    }

    const result = await this.joinRequestService.createJoinStatus(groupId, this.ctx.userId, JoinStatus.ACCEPTED);
    group.members.push(ObjectId(this.ctx.userId));
    await group.save();

    return result;
  }

  async leave(groupId: string): Promise<JoinStatusResponse> {
    const group = await this._findById(groupId);

    if (!this.isMember(group)) {
      throw new GeneralException(GroupCause.NOT_MEMBER_OF_GROUP);
    }

    const result = await this.joinRequestService.leave(groupId);

    group.members = group.members.filter(userId => userId.toString() !== this.ctx.userId);
    await group.save();

    return result;
  }

  async acceptJoinRequest(groupId: string, userId: string): Promise<void> {
    const groupDoc = await this._findById(groupId);
    this.checkIfOwner(groupDoc);
    await this.joinRequestService.accept(groupId, userId);
  }

  async declineJoinRequest(groupId: string, userId: string): Promise<void> {
    const groupDoc = await this._findById(groupId);
    this.checkIfOwner(groupDoc);
    await this.joinRequestService.decline(groupId, userId);
  }

  async banUser(groupId: string, userId: string): Promise<void> {
    const group = await this._findById(groupId);
    this.checkIfOwner(group);
    await this.joinRequestService.banUser(groupId, userId);
    group.members = group.members.filter(_userId => _userId.toString() !== userId);
    group.bannedUsers.push(ObjectId(userId));
    await this._saveAndAudit(group, this.ctx.userId);
  }

  async allowUser(groupId: string, userId: string): Promise<void> {
    const group = await this._findById(groupId);
    this.checkIfOwner(group);
    await this.joinRequestService.allowUser(groupId, userId);
    group.bannedUsers = group.bannedUsers.filter(_userId => _userId.toString() !== userId);
    await this._saveAndAudit(group, this.ctx.userId);
  }

  async create(createRequest: GroupRequest): Promise<GroupResponse> {
    const group = this.createRequestToModel(createRequest, this.ctx.userId);
    await this._saveAndAudit(group, this.ctx.userId);
    return GroupMapper.modelToResponse(group,
      _ => this.isEditable(_),
      _ => this.isMember(_)
    );
  }

  async update(updateRequest: GroupRequest, groupId: string): Promise<GroupResponse> {
    let group = await this._findById(groupId);
    this.checkIfOwner(group);

    this.updateRequestToModel(updateRequest, group);
    group = await this._saveAndAudit(group, this.ctx.userId);
    return GroupMapper.modelToResponse(group,
      _ => this.isEditable(_),
      _ => this.isMember(_));
  }

  async delete(groupId) {
    const group = await this._findById(groupId);
    this.checkIfOwner(group);
    await group.remove();
  }

  private isEditable(group: GroupDoc): boolean {
    return getDocumentId(group.owner) === this.ctx.userId;
  }

  private isMember(group: GroupDoc): boolean {
    return getDocumentId(group.owner) === this.ctx.userId ||
      group.members.map(getDocumentId).indexOf(this.ctx.userId) > -1;
  }

  private checkIfOwner(group: GroupDoc): void {
    if (!this.isOwner(group)) {
      throw new ForbiddenException();
    }
  }

  private isOwner(group: GroupDoc): boolean {
    return group.owner.toString() === this.ctx.userId;
  }

  private createRequestToModel(request: GroupRequest, owner: string): GroupDoc {
    return new this.model({
      name: request.name,
      joinPolicy: request.joinPolicy,
      description: request.description,
      owner: ObjectId(owner),
      members: [],
      paths: [],
    } as GroupDoc);
  }

  private updateRequestToModel(request: GroupRequest, model: GroupDoc) {
    model.name = request.name;
    model.description = request.description;
    model.joinPolicy = request.joinPolicy;
  }
}
