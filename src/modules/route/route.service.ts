import {Model} from "mongoose";
import {RouteMapper} from "./route.mapper";
import {InjectModel} from "@nestjs/mongoose";
import {Route, RouteVisibility} from "./route.schema";
import {RouteResponse} from "../../api/route/route.response";
import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {GroupService} from "../group/group.service";
import {ForbiddenException} from "../../api/errors/errors";
import {Group} from "../group/group.schema";
import {UpdateRouteRequest} from "../../api/route/update-route.request";
import {CreateRouteRequest} from "../../api/route/create-route.request";

@Injectable()
export class RouteService extends BaseService<Route> {
  public constructor(@InjectModel('Route') routeModel: Model<Route>,
                     private groupService: GroupService) {
    super(routeModel);
  }

  async create(request: CreateRouteRequest, userId: string): Promise<string> {
    const route = new this.model();
    RouteMapper.createRequestToModel(request, route);
    route.owner = userId;
    return this._saveAndAudit(route, userId).then(route => route._id);
  }

  async update(request: UpdateRouteRequest, routeId: string, userId: string): Promise<void> {
    await this._fetchById(routeId);
    const route = new this.model();
      RouteMapper.updateRequestToModel(request, route);
    route._id = routeId;
    await this._saveAndAudit(route, userId);
  }

  async deleteById(routeId: string, userId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    if (route.owner !== userId) {
      throw new ForbiddenException();
    }
    return this._removeById(routeId)
  }

  async findById(routeId: string, userId: string): Promise<RouteResponse> {
    const route = await this.model.findById(routeId).populate('group');
    const group = route.group as Group;
    if (route.visibility === RouteVisibility.PRIVATE && route.owner !== userId) {
      throw new ForbiddenException();
    }
    if (route.visibility === RouteVisibility.GROUP && group && !this.isUserInGroup(group, userId)) {
      throw new ForbiddenException();
    }
    return RouteMapper.modelToResponse(route);
  }

  async shareInGroup(routeId: string, groupId: string, userId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    const group = await this.groupService._fetchById(groupId);
    if (!this.isUserInGroup(group, userId)) {
      throw new ForbiddenException();
    }
    route.visibility = RouteVisibility.GROUP;
    route.group = group;
    await this._saveAndAudit(route, userId);
  }

  async publish(routeId: string, userId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    if (route.visibility === RouteVisibility.PUBLIC) {
      return;
    }
    if (route.owner !== userId) {
      throw new ForbiddenException();
    }
    route.visibility = RouteVisibility.PUBLIC;
    await this._saveAndAudit(route, userId);
  }

  private isUserInGroup(group: Group, userId: string): boolean {
    return group.members.findIndex(_userId => _userId === userId) > -1;
  }
}
