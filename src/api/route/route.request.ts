import {RouteState} from "../../modules/route/route.schema";
import {IsNotEmpty} from "class-validator";
import {IPolygon} from "../../core/schemas/polygon.schema";


export class RouteRequest {
  @IsNotEmpty()
  title: string;
  description: string;
  @IsNotEmpty()
  state: RouteState;
  @IsNotEmpty()
  path: IPolygon;
}
