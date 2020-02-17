import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {Group, GroupAccess} from "./group.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CreateGroupRequest, GroupPageResponse, GroupResponse, PageResponse, UpdateGroupRequest} from "tyr-api";
import {ContextService} from "../../core/services/context.service";
import {CreatedResponse} from "../../core/dto/created.response";
import {ForbiddenException} from "../../errors/errors";
import {mapResultsToPageResponse} from "../../core/util/pagination/pagination-mapper";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";


@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>,
              private ctx: ContextService) {
    super(model);
  }

  findById(id: string): Promise<GroupResponse> {
    return this._fetchById(id).then(this.modelToResponse);
  }

  async findAllGroupsByPage(options: PaginationOptions): Promise<GroupPageResponse> {
    return mapResultsToPageResponse(await this._findPage(options), this.modelsToResponse.bind(this));
  }

  async join(groupId: string) {
    const group = await this._fetchById(groupId);
    if (group.members.findIndex(userId => this.ctx.userId === userId) > -1) {
      return;
    }
    (group.members as string[]).push(this.ctx.userId);
    await group.save();
  }

  async leave(groupId: string) {
    const group = await this._fetchById(groupId);
    if (group.members.findIndex(userId => this.ctx.userId === userId) === -1) {
      return;
    }
    group.members = (group.members as string[]).filter(userId => userId !== this.ctx.userId);
    await group.save();
  }

  async create(createRequest: CreateGroupRequest): Promise<CreatedResponse> {
    const group = this.createRequestToModel(createRequest, this.ctx.userId);
    await group.save();
    return CreatedResponse.of(group);
  }

  async update(updateRequest: UpdateGroupRequest, groupId: string): Promise<void> {
    const group = await this._fetchById(groupId);
    this.updateRequestToModel(updateRequest, group);
    await group.save();
  }

  async delete(groupId) {
    const group = await this._fetchById(groupId);
    if (group.owner !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    await group.remove();
  }

  private createRequestToModel(request: CreateGroupRequest, owner: string): Group {
    return new this.model(<Group>{
      name: request.name,
      access: request.access,
      description: request.description,
      owner: owner,
      members: [],
      routes: []
    });
  }

  private updateRequestToModel(request: UpdateGroupRequest, model: Group) {
    model.name = request.name;
    model.description = request.description;
    model.access = GroupAccess[request.access];
  }

  private modelsToResponse(models: Group[]): GroupResponse[] {
    return models.map(this.modelToResponse);
  }

  private modelToResponse(model: Group): GroupResponse {
    const response = new GroupResponse();

    response.name = model.name;
    response.access = model.access;
    response.owner = model.owner as string;
    response.description = model.description;

    return response;
  }
}
