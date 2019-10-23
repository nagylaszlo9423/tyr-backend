import {IsNotEmpty} from "class-validator";
import {Polygon} from "../../core/schemas/polygon.schema";


export class RouteRequest {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  path: Polygon;
}
