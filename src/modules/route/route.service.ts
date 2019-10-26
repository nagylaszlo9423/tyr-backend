import {Model} from "mongoose";
import {RouteMapper} from "./route.mapper";
import {InjectModel} from "@nestjs/mongoose";
import {Route, RouteVisibility} from "./route.schema";
import {RouteResponse} from "../../api/route/route.response";
import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {GroupService} from "../group/group.service";
import {ForbiddenException, GeneralException} from "../../api/errors/errors";
import {Group} from "../group/group.schema";
import {UpdateRouteRequest} from "../../api/route/update-route.request";
import {CreateRouteRequest} from "../../api/route/create-route.request";
import {ContextService} from "../../core/services/context.service";

@Injectable()
export class RouteService extends BaseService<Route> {
  public constructor(@InjectModel('Route') routeModel: Model<Route>,
                     private groupService: GroupService,
                     private ctx: ContextService) {
    super(routeModel);
  }

  async create(request: CreateRouteRequest): Promise<string> {
    const route = new this.model();
    RouteMapper.createRequestToModel(request, route);
    route.owner = this.ctx.userId;
    return this._saveAndAudit(route, this.ctx.userId).then(route => route._id);
  }

  async update(request: UpdateRouteRequest, routeId: string): Promise<void> {
    await this._fetchById(routeId);
    const route = new this.model();
      RouteMapper.updateRequestToModel(request, route);
    route._id = routeId;
    await this._saveAndAudit(route, this.ctx.userId);
  }

  async deleteById(routeId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    if (route.owner !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    return this._removeById(routeId)
  }

  async findById(routeId: string): Promise<RouteResponse> {
    const route = await this.model.findById(routeId).populate('group');
    const group = route.group as Group;
    if (route.visibility === RouteVisibility.PRIVATE && route.owner !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    if (route.visibility === RouteVisibility.GROUP && group && !this.isUserInGroup(group)) {
      throw new ForbiddenException();
    }
    return RouteMapper.modelToResponse(route);
  }

  async findAllByGroup(groupId: string): Promise<RouteResponse[]> {
    const group = await this.groupService._fetchById(groupId);
    if (!this.isUserInGroup(group)) {
      throw new GeneralException("NOT_MEMBER_OF_THE_GROUP");
    }

    const routes: Route[] = await this.model.find({group: groupId}).exec();
    return RouteMapper.modelsToResponses(routes);
  }

  async shareInGroup(routeId: string, groupId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    const group = await this.groupService._fetchById(groupId);
    if (!this.isUserInGroup(group)) {
      throw new GeneralException("NOT_MEMBER_OF_THE_GROUP");
    }
    route.visibility = RouteVisibility.GROUP;
    route.group = group;
    await this._saveAndAudit(route, this.ctx.userId);
  }

  async publish(routeId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    if (route.visibility === RouteVisibility.PUBLIC) {
      throw new GeneralException('ROUTE_ALREADY_PUBLISHED');
    }
    if (route.owner !== this.ctx.userId) {
      throw new ForbiddenException();
    }
    route.visibility = RouteVisibility.PUBLIC;
    await this._saveAndAudit(route, this.ctx.userId);
  }

  private isUserInGroup(group: Group): boolean {
    return group.members.findIndex(_userId => _userId === this.ctx.userId) > -1;
  }
}
