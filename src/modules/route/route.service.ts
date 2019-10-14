import {Injectable} from "@nestjs/common";
import {RouteRequest} from "../../api/route/route.request";
import {InjectModel} from "@nestjs/mongoose";
import {IRoute} from "./route.schema";
import {Model} from "mongoose";
import {RouteResponse} from "../../api/route/route.response";
import {createAudit, modifyAudit} from "../../core/schemas/audit.schema";
import {NotFoundException} from "../../api/errors/errors";

@Injectable()
export class RouteService {

  constructor(@InjectModel('Route') private routeModel: Model<IRoute>) {

  }

  async create(request: RouteRequest, userId: string): Promise<string> {
    const route: IRoute = new this.routeModel();
    this.routeRequestToModel(route, request);
    route.audit = await createAudit(userId);
    return route.save().then(route => route._id);
  }

  async update(request: RouteRequest, id: string, userId: string): Promise<void> {
    const route: IRoute = await this.fetchById(id);

    this.routeRequestToModel(route, request);
    route.audit = await modifyAudit(route.audit, userId);
    await route.save();
  }

  async delete(id: string): Promise<void> {
    const route: IRoute = await this.fetchById(id);
    await route.remove();
  }

  async findById(id: string): Promise<RouteResponse> {
    return this.routeModelToResponse(await this.fetchById(id));
  }

  async findAllByUser(userId: string): Promise<RouteResponse[]> {

  }

  async findAllByGroup(groupId: string, userId: string): Promise<RouteResponse[]> {

  }

  async findAllPublic(): Promise<RouteResponse[]> {

  }

  async changeState(routeId: string, userId: string): Promise<void> {

  }

  private async fetchById(id: string): Promise<IRoute> {
    const route: IRoute = await this.routeModel.findById(id).exec();
    if (!route) {
      throw new NotFoundException();
    }
    return route;
  }

  private routeRequestToModel(model: IRoute, request: RouteRequest) {
    model.title = request.title;
    model.description = request.description;
    model.path = request.path;
    model.state = request.state;
  }

  private routeModelToResponse(model: IRoute): RouteResponse {
    const result = new RouteResponse();

    result.title = model.title;
    result.description = model.description;
    result.path = model.path;
    result.state = model.state;
    result.audit = model.audit;

    return result;
  }

}
