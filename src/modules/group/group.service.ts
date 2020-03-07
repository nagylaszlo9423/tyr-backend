import {Injectable, Query} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {Group} from "./group.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ContextService} from "../../core/services/context.service";
import {CreatedResponse} from "../../core/dto/created.response";
import {ForbiddenException} from "../../core/errors/errors";
import {mapResultsToPageResponse} from "../../core/util/pagination/pagination-mapper";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";
import {GroupResponse} from "../../dtos/group/group-response";
import {PageResponse} from "../../core/dto/page.response";
import {GroupRequest} from "../../dtos/group/group.request";
import {GroupMapper} from "./group.mapper";
import {GroupQueries} from "./group.queries";
import {GroupFilter} from "./enums/group-filter";
import {User} from "../user/user.schema";


@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>,
              private ctx: ContextService) {
    super(model);
  }

  findById(id: string): Promise<GroupResponse> {
    return this._findById(id).then(_ => GroupMapper.modelToResponse(_, this.isEditable(_)));
  }

  async findAllGroupsByPage(options: PaginationOptions, filters: GroupFilter[], searchExp: string, sortBy: string): Promise<PageResponse<GroupResponse>> {
    return mapResultsToPageResponse(await this._findPage(
      options,
      GroupQueries.queryAllByFilters(this.ctx.userId, filters, searchExp),
      GroupQueries.sortByFilters.bind(this, sortBy)
    ), GroupMapper.modelsToResponse.bind(this));
  }

  async join(groupId: string) {
    const group = await this._findById(groupId);
    if (group.members.findIndex(userId => this.ctx.userId === userId) > -1) {
      return;
    }
    (group.members as string[]).push(this.ctx.userId);
    await group.save();
  }

  async leave(groupId: string) {
    const group = await this._findById(groupId);
    if (group.members.findIndex(userId => this.ctx.userId === userId) === -1) {
      return;
    }
    group.members = (group.members as string[]).filter(userId => userId !== this.ctx.userId);
    await group.save();
  }

  async create(createRequest: GroupRequest): Promise<CreatedResponse> {
    const group = this.createRequestToModel(createRequest, this.ctx.userId);
    await this._saveAndAudit(group, this.ctx.userId);
    return CreatedResponse.of(group);
  }

  async update(updateRequest: GroupRequest, groupId: string): Promise<void> {
    const group = await this._findById(groupId);
    this.updateRequestToModel(updateRequest, group);
    await this._saveAndAudit(group, this.ctx.userId);
  }

  async delete(groupId) {
    const group = await this._findById(groupId);
    if (group.owner !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    await group.remove();
  }

  private isEditable(group: Group): boolean {
    if (typeof group.members[0] === "object") {
      const groupMembers = group.members as Array<User>;
      return groupMembers.filter(_ => _._id === this.ctx.userId).length > -1;
    } else if (typeof group.members[0] === "string") {
      const groupMembers = group.members as Array<string>;
      return groupMembers.indexOf(this.ctx.userId) > -1;
    }
    return false;
  }

  private createRequestToModel(request: GroupRequest, owner: string): Group {
    return new this.model(<Group>{
      name: request.name,
      joinPolicy: request.joinPolicy,
      description: request.description,
      owner: owner,
      members: [],
      paths: []
    });
  }

  private updateRequestToModel(request: GroupRequest, model: Group) {
    model.name = request.name;
    model.description = request.description;
    model.joinPolicy = request.joinPolicy;
  }
}
