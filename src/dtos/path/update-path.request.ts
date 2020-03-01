import {LineStringDto} from "./line-string.dto";

export class UpdatePathRequest {
    title: string;
    description: string;
    path: LineStringDto;
}
