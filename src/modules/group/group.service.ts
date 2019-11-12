import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {Group} from "./group.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CreateGroupRequest, GroupResponse, PageResponse, UpdateGroupRequest} from "tyr-api";
import {mapResultsToPageResponse, PaginationOptions} from "../../core/util/pagination";
import {ContextService} from "../../core/services/context.service";


@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>,
              private ctx: ContextService) {
    super(model);
  }

  async findById(id: string): Promise<GroupResponse> {
    return this._fetchById(id);
  }

  async findAllGroupsByPage(options: PaginationOptions): Promise<PageResponse> {
    const results: Group[] = await this.model.find().skip(options.skip()).limit(options.size).exec();
    const groupResponse = results.map(GroupService.modelToResponse);
    return mapResultsToPageResponse(groupResponse, options);
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

  async create(createRequest: CreateGroupRequest, userId: string): Promise<string> {
    return Promise.resolve('');
  }

  async update(updateRequest: UpdateGroupRequest, userId: string): Promise<void> {
    return Promise.resolve();
  }

  private static modelToResponse(model: Group): GroupResponse {
    const response = new GroupResponse();

    response.name = model.name;
    response.access = model.access;
    response.description = model.description;

    return response;
  }
}
