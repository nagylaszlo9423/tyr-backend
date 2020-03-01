import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {Group} from "./group.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ContextService} from "../../core/services/context.service";
import {CreatedResponse} from "../../core/dto/created.response";
import {ForbiddenException} from "../../errors/errors";
import {mapResultsToPageResponse} from "../../core/util/pagination/pagination-mapper";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";
import {GroupResponse} from "../../dtos/group/group-response";
import {GroupJoinPolicy} from "./group-join-policy";
import {PageResponse} from "../../core/dto/page.response";
import {GroupRequest} from "../../dtos/group/group.request";


@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>,
              private ctx: ContextService) {
    super(model);
  }

  findById(id: string): Promise<GroupResponse> {
    return this._fetchById(id).then(this.modelToResponse);
  }

  async findAllGroupsByPage(options: PaginationOptions): Promise<PageResponse<GroupResponse>> {
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

  async create(createRequest: GroupRequest): Promise<CreatedResponse> {
    const group = this.createRequestToModel(createRequest, this.ctx.userId);
    await group.save();
    return CreatedResponse.of(group);
  }

  async update(updateRequest: GroupRequest, groupId: string): Promise<void> {
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
    model.joinPolicy = GroupJoinPolicy[request.joinPolicy];
  }

  private modelsToResponse(models: Group[]): GroupResponse[] {
    return models.map(this.modelToResponse);
  }

  private modelToResponse(model: Group): GroupResponse {
    const response = new GroupResponse();

    response.id = model._id;
    response.name = model.name;
    response.joinPolicy = model.joinPolicy;
    response.owner = model.owner as string;
    response.description = model.description;

    return response;
  }
}
