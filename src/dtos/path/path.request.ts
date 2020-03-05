import {LineStringDto} from "./line-string.dto";

export class PathRequest {
    name: string;
    description: string;
    path: LineStringDto;
}
