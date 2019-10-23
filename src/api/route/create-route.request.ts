import {RouteRequest} from "./route.request";
import {IsNotEmpty} from "class-validator";
import {RouteVisibility} from "../../modules/route/route.schema";


export class CreateRouteRequest extends RouteRequest {
  @IsNotEmpty()
  visibility: RouteVisibility;
}
