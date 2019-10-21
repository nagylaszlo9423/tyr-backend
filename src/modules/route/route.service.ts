import {Model, Schema, Types} from "mongoose";
import {Audit, modifyAudit} from "../../core/schemas/audit.schema";
import {RouteMapper} from "./route.mapper";
import {InjectModel} from "@nestjs/mongoose";
import {Route, RouteState} from "./route.schema";
import {RouteRequest} from "../../api/route/route.request";
import {RouteResponse} from "../../api/route/route.response";
import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/base.service";
import {UserService} from "../user/user.service";
import {GroupService} from "../group/group.service";
import {ForbiddenException} from "../../api/errors/errors";

@Injectable()
export class RouteService extends BaseService<Route> {
  public constructor(@InjectModel('Route') routeModel: Model<Route>,
                     private groupService: GroupService) {
    super(routeModel);
  }

  public async create(request: RouteRequest, userId: string): Promise<string> {
    const route = new this.model();
    RouteMapper.requestToModel(request, route);
    route.audit = await modifyAudit(route.audit, userId);
    route.owner = new Schema.Types.ObjectId(userId);
    return route.save().then(route => route._id);
  }

  async update(request: RouteRequest, id: string, userId: string): Promise<void> {
    await this.fetchById(id);
    const route = new this.model();
      RouteMapper.requestToModel(request, route);
    route._id = id;
    await this.saveAndAudit(route, userId);
  }

  async deleteById(id: string): Promise<void> {
    return this.removeById(id)
  }

  async findById(id: string): Promise<RouteResponse> {
    return RouteMapper.modelToResponse(await this.fetchById(id));
  }

  async shareInGroup(routeId: string, groupId: string, userId: string): Promise<void> {
    const route = await this.fetchById(routeId);
    const group = await this.groupService.fetchById(groupId);
    const isUserInGroup = group.users.findIndex(_userId => _userId === userId) > -1;
    if (!isUserInGroup) {
      throw new ForbiddenException();
    }
    route.state = RouteState.GROUP;
    route.group = group;
    await this.saveAndAudit(route, userId);
  }

  async publish(): Promise<void> {

  }
}
