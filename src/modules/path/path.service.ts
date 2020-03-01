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
import {CreatePathRequest} from "../../dtos/path/create-path.request";
import {PathResponse} from "../../dtos/path/path-response";
import {UserService} from "../user/user.service";
import {ObjectId} from "../../db/mongoose";
import {PathMapper} from "./path.mapper";
import {Path, PathVisibility} from "./path.schema";
import {UpdatePathRequest} from "../../dtos/path/update-path.request";

@Injectable()
export class PathService extends BaseService<Path> {
  public constructor(@InjectModel('Path') pathModel: Model<Path>,
                     @InjectModel('LineString') private lineStringModel: Model<LineString>,
                     private userService: UserService,
                     private groupService: GroupService,
                     private ctx: ContextService) {
    super(pathModel);
  }

  async create(request: CreatePathRequest): Promise<CreatedResponse> {
    const path = new this.model();
    path.path = new this.lineStringModel();
    PathMapper.createRequestToModel(request, path);
    path.owner = ObjectId(this.ctx.userId) as any;
    path.visibility = PathVisibility.PRIVATE;
    return CreatedResponse.of(await this._saveAndAudit(path, this.ctx.userId));
  }

  async update(request: UpdatePathRequest, pathId: string): Promise<void> {
    const path = await this._fetchById(pathId);
    if (path.owner.toString() !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    PathMapper.updateRequestToModel(request, path);
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

  async findAllAvailable() {
    const user = await this.userService.findById(this.ctx.userId);
    const paths = await this.model.find().populate('group').or([
      {'group.id': {$in: user.groups}},
      {'owner': user._id}
    ]).exec();
    return PathMapper.modelsToResponses(paths, this.ctx.userId);
  }

  async findAllByCurrentUser() {
    return PathMapper.modelsToResponses(await this.model.find({owner: this.ctx.userId}).exec(), this.ctx.userId);
  }

  async findAllByGroup(groupId: string): Promise<PathResponse[]> {
    const group = await this.groupService._fetchById(groupId);
    if (!this.isUserInGroup(group)) {
      throw new GeneralException("NOT_MEMBER_OF_THE_GROUP");
    }

    const paths: Path[] = await this.model.find({group: groupId}).exec();
    return PathMapper.modelsToResponses(paths, this.ctx.userId);
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
}
