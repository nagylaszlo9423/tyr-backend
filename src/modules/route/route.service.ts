import {Model} from "mongoose";
import {RouteMapper} from "./route.mapper";
import {InjectModel} from "@nestjs/mongoose";
import {Route, RouteVisibility} from "./route.schema";
import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/services/base.service";
import {GroupService} from "../group/group.service";
import {ForbiddenException, GeneralException} from "../../errors/errors";
import {Group} from "../group/group.schema";
import {ContextService} from "../../core/services/context.service";
import {LineString} from "../../core/schemas/line-string.schema";
import {CreateRouteRequest, RouteResponse, UpdateRouteRequest} from "tyr-api";

@Injectable()
export class RouteService extends BaseService<Route> {
  public constructor(@InjectModel('Route') routeModel: Model<Route>,
                     @InjectModel('LineString') private lineStringModel: Model<LineString>,
                     private groupService: GroupService,
                     private ctx: ContextService) {
    super(routeModel);
  }

  async create(request: CreateRouteRequest): Promise<string> {
    const route = new this.model();
    route.path = new this.lineStringModel();
    RouteMapper.createRequestToModel(request, route);
    route.owner = this.ctx.userId;
    route.visibility = RouteVisibility.PRIVATE;
    return this._saveAndAudit(route, this.ctx.userId).then(route => route._id);
  }

  async update(request: UpdateRouteRequest, routeId: string): Promise<void> {
    const route = await this._fetchById(routeId);
    RouteMapper.updateRequestToModel(request, route);
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
