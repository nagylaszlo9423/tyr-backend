import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Injectable} from '@nestjs/common';
import {BaseService} from '../../core/services/base.service';
import {GroupService} from '../group/group.service';
import {ForbiddenException, GeneralException} from '../../core/errors/exceptions';
import {GroupDoc} from '../group/group.schema';
import {ContextService} from '../../core/services/context.service';
import {LineString} from '../../core/schemas/line-string.schema';
import {CreatedResponse} from '../../dtos/created.response';
import {UserService} from '../user/user.service';
import {ObjectId} from '../../db/mongoose';
import {PathMapper} from './path.mapper';
import {Path} from './path.schema';
import {PageResponse} from '../../dtos/page.response';
import {PaginationOptions} from '../../core/util/pagination/pagination-options';
import {Page} from '../../core/util/pagination/page';
import {PathRequest} from '../../dtos/path/path.request';
import {PathQueries} from './path.queries';
import {PathResponse} from '../../dtos/path/path.response';
import {PathVisibility} from './enums/path-visibility';
import {PathCause} from '../../core/errors/cause/path.cause';
import {GroupCause} from '../../core/errors/cause/group.cause';
import {FindPathsInAreaRequest} from '../../dtos/path/find-paths-in-area.request';
import {FeatureType} from '../../core/feature-type.enum';

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
    return this._removeById(pathId);
  }

  async findById(pathId: string): Promise<PathResponse> {
    const path = await this.model.findById(pathId).populate('group').exec();
    const group = path.group as GroupDoc;
    if (path.visibility === PathVisibility.PRIVATE && path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    if (path.visibility === PathVisibility.GROUP && !this.isUserInGroup(group)) {
      throw new ForbiddenException();
    }
    return PathMapper.modelToResponse(path, this.ctx.userId);
  }

  async findAllAvailableByArea(body: FindPathsInAreaRequest): Promise<PathResponse[]> {
    const user = await this.userService.findById(this.ctx.userId);
    if (body.feature.type !== FeatureType.POLYGON) {
      throw new GeneralException(PathCause.INVALID_GEO_FEATURE_TYPE);
    }
    const results = await this.model.find({
      path: {$geoWithin: {$geometry: body.feature}},
      ...PathQueries.queryAllAvailable(user)
    }).exec();
    return results.map(_ => PathMapper.modelToResponse(_, this.ctx.userId));
  }

  async findAllAvailableByFilters(options: PaginationOptions, filters: number[], sortBy: string, searchExp?: string): Promise<PageResponse<PathResponse>> {
    const user = await this.userService.findById(this.ctx.userId);
    const results: Page<Path> = await this._findPage(
      options,
      PathQueries.queryByFilters(user, filters, searchExp),
      PathQueries.sortByFilters.bind(this, sortBy),
    );
    return PathMapper.modelsPageToResponse(results, user._id.toString());
  }

  async shareInGroup(pathId: string, groupId: string): Promise<void> {
    const path = await this._findById(pathId);
    const group = await this.groupService._findById(groupId);
    if (!this.isUserInGroup(group)) {
      throw new GeneralException(GroupCause.NOT_MEMBER_OF_GROUP);
    }
    path.visibility = PathVisibility.GROUP;
    path.group = group;
    await this._saveAndAudit(path, this.ctx.userId);
  }

  async publish(pathId: string): Promise<void> {
    const path = await this._findById(pathId);
    if (path.visibility === PathVisibility.PUBLIC) {
      throw new GeneralException(PathCause.PATH_ALREADY_PUBLISHED);
    }
    if (path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    path.visibility = PathVisibility.PUBLIC;
    await this._saveAndAudit(path, this.ctx.userId);
  }

  private isUserInGroup(group: GroupDoc): boolean {
    return group && group.members.findIndex(_userId => _userId.toString() === this.ctx.userId) > -1;
  }
}
