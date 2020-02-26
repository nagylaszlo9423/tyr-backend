import {LineStringDto} from "./line-string.dto";

export class CreateRouteRequest {
    title: string;
    description: string;
    path: LineStringDto;
}
