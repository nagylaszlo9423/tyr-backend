import {RouteVisibility} from "../../modules/route/route.schema";
import {IPolygon} from "../../core/schemas/polygon.schema";
import {IAudit} from "../../core/schemas/audit.schema";


export class RouteResponse {
  title: string;
  description: string;
  path: IPolygon;
  audit: IAudit;
}
