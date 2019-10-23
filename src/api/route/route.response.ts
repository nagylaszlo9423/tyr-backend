import {Polygon} from "../../core/schemas/polygon.schema";
import {Audit} from "../../core/schemas/audit.schema";


export class RouteResponse {
  title: string;
  description: string;
  path: Polygon;
  audit: Audit;
}
