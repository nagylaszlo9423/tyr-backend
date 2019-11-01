import {IsNotEmpty} from "class-validator";
import {LineStringDto} from "../geojson/line-string.dto";


export class RouteRequest {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  path: LineStringDto;
}
