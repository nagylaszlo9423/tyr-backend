import {LineStringDto} from "./line-string.dto";

export class CreatePathRequest {
    title: string;
    description: string;
    path: LineStringDto;
}
