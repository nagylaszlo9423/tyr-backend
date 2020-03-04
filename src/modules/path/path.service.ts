import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {GroupService} from "../group/group.service";
import {ForbiddenException, GeneralException} from "../../errors/errors";
import {Group} from "../group/group.schema";
import {ContextService} from "../../core/services/context.service";
import {LineString} from "../../core/schemas/line-string.schema";
import {CreatedResponse} from "../../core/dto/created.response";
import {PathResponse} from "../../dtos/path/path-response";
import {UserService} from "../user/user.service";
import {ObjectId} from "../../db/mongoose";
import {PathMapper} from "./path.mapper";
import {Path, PathVisibility} from "./path.schema";
import {PageResponse} from "../../core/dto/page.response";
import {PaginationOptions} from "../../core/util/pagination/pagination-options";
import {Page} from "../../core/util/pagination/page";
import {User} from "../user/user.schema";
import {PathRequest} from "../../dtos/path/path.request";
import {PathSortOptions} from "./path-sort-options";

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
    const path = await this._fetchById(pathId);
    if (path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    PathMapper.requestToModel(request, path);
    await this._saveAndAudit(path, this.ctx.userId);
  }

  async deleteById(pathId: string): Promise<void> {
    const path = await this._fetchById(pathId);
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

  async findAllAvailableByFilters(options: PaginationOptions, filters: string[], sortBy: string, searchExp?: string): Promise<PageResponse<PathResponse>> {
    const user = await this.userService.findById(this.ctx.userId);
    const results: Page<Path> = await this._findPage(
      options,
      this.constructQueryByFilters(user, filters, sortBy, searchExp),
      query => query.collation({ locale: "en" }).sort(this.constructSortByFilter(sortBy))
    );
    return PathMapper.modelsPageToResponse(results, user._id.toString());
  }

  async shareInGroup(pathId: string, groupId: string): Promise<void> {
    const path = await this._fetchById(pathId);
    const group = await this.groupService._fetchById(groupId);
    if (!this.isUserInGroup(group)) {
      throw new GeneralException("NOT_MEMBER_OF_THE_GROUP");
    }
    path.visibility = PathVisibility.GROUP;
    path.group = group;
    await this._saveAndAudit(path, this.ctx.userId);
  }

  async publish(pathId: string): Promise<void> {
    const path = await this._fetchById(pathId);
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

  private constructSortByFilter(sortBy: string): { [key: string]: 1 | -1 } {
    switch (sortBy) {
      default:
      case PathSortOptions.LAST_CREATED:
        return {'audit.createdAt': 1};
      case PathSortOptions.OLDEST_CREATED:
        return {'audit.createdAt': -1};
      case PathSortOptions.LAST_MODIFIED:
        return {'audit.modifiedAt': 1};
      case PathSortOptions.OLDEST_MODIFIED:
        return {'audit.modifiedAt': -1};
      case PathSortOptions.NAME_ASC:
        return {'title': 1};
      case PathSortOptions.NAME_DESC:
        return {'title': -1};
      case PathSortOptions.VISIBILITY:
        return {'visibility': 1};
    }
  }

  private constructQueryByFilters(user: User, filters: string[], sortBy: string, searchExp: string): any {
    const query = {$or: []};
    filters.forEach(filter => {
      switch (filter) {
        case 'own':
          query.$or.push({owner: user._id.toString()});
          break;
        case 'groups':
          query.$or.push({
            group: {$in: user.groups},
            owner: {$ne: user._id.toString()}
          });
          break;
        case 'public':
          query.$or.push({
            visibility: PathVisibility.PUBLIC,
            owner: {$ne: user._id.toString()}
          });
      }
    });
    if (searchExp) {
      query['$text'] = {$search: searchExp};
    }
    return query;
  }
}
