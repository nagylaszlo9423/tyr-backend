import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {GroupService} from "../group/group.service";
import {ForbiddenException, GeneralException} from "../../core/errors/errors";
import {Group} from "../group/group.schema";
import {ContextService} from "../../core/services/context.service";
import {LineString} from "../../core/schemas/line-string.schema";
import {CreatedResponse} from "../../core/dto/created.response";
import {UserService} from "../user/user.service";
import {ObjectId} from "../../db/mongoose";
import {PathMapper} from "./path.mapper";
import {Path} from "./path.schema";
import {PageResponse} from "../../core/dto/page.response";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";
import {Page} from "../../core/util/pagination/page";
import {PathRequest} from "../../dtos/path/path.request"
import {PathQueries} from "./path.queries";
import {PathResponse} from "../../dtos/path/path.response";
import {PathVisibility} from "./enums/path-visibility";

@Injectable()
export class PathService extends BaseService<Path> {
  public constructor(@InjectModel('Path') pathModel: Model<Path>,
                     @InjectModel('LineString') private lineStringModel: Model<LineString>,
                     private userService: UserService,
                     private groupService: GroupService,
                     private ctx: ContextService) {
    super(pathModel);
  }

  async create(request: PathRequest): Promise<CreatedResponse> {
    const path = new this.model();
    path.path = new this.lineStringModel();
    PathMapper.requestToModel(request, path);
    path.owner = ObjectId(this.ctx.userId) as any;
    path.visibility = PathVisibility.PRIVATE;
    return CreatedResponse.of(await this._saveAndAudit(path, this.ctx.userId));
  }

  async update(request: PathRequest, pathId: string): Promise<void> {
    const path = await this._findById(pathId);
    if (path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    PathMapper.requestToModel(request, path);
    await this._saveAndAudit(path, this.ctx.userId);
  }

  async deleteById(pathId: string): Promise<void> {
    const path = await this._findById(pathId);
    if (path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    return this._removeById(pathId)
  }

  async findById(pathId: string): Promise<PathResponse> {
    const path = await this.model.findById(pathId).populate('group').exec();
    const group = path.group as Group;
    if (path.visibility === PathVisibility.PRIVATE && path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    if (path.visibility === PathVisibility.GROUP && !this.isUserInGroup(group)) {
      throw new ForbiddenException();
    }
    return PathMapper.modelToResponse(path, this.ctx.userId);
  }

  async findAllAvailableByFilters(options: PaginationOptions, filters: number[], sortBy: string, searchExp?: string): Promise<PageResponse<PathResponse>> {
    const user = await this.userService.findById(this.ctx.userId);
    const results: Page<Path> = await this._findPage(
      options,
      PathQueries.queryByFilters(user, filters, searchExp),
      PathQueries.sortByFilters.bind(this, sortBy)
    );
    return PathMapper.modelsPageToResponse(results, user._id.toString());
  }

  async shareInGroup(pathId: string, groupId: string): Promise<void> {
    const path = await this._findById(pathId);
    const group = await this.groupService._findById(groupId);
    if (!this.isUserInGroup(group)) {
      throw new GeneralException("NOT_MEMBER_OF_THE_GROUP");
    }
    path.visibility = PathVisibility.GROUP;
    path.group = group;
    await this._saveAndAudit(path, this.ctx.userId);
  }

  async publish(pathId: string): Promise<void> {
    const path = await this._findById(pathId);
    if (path.visibility === PathVisibility.PUBLIC) {
      throw new GeneralException('PATH_ALREADY_PUBLISHED');
    }
    if (path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    path.visibility = PathVisibility.PUBLIC;
    await this._saveAndAudit(path, this.ctx.userId);
  }

  private isUserInGroup(group: Group): boolean {
    return group && group.members.findIndex(_userId => _userId === this.ctx.userId) > -1;
  }
}