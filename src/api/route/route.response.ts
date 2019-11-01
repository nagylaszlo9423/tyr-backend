import {Polygon} from "../../core/schemas/polygon.schema";
import {Audit} from "../../core/schemas/audit.schema";
import {LineStringDto} from "../geojson/line-string.dto";


export class RouteResponse {
  title: string;
  description: string;
  path: LineStringDto;
  audit: Audit;
}
