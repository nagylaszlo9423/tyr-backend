import {LineStringDto} from "./line-string.dto";

export class UpdateRouteRequest {
    title: string;
    description: string;
    path: LineStringDto;
}
