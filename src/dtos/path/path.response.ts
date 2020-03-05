import {LineStringDto} from "./line-string.dto";
import {AuditDto} from "../../core/dto/audit.dto";
import {ResourceItemResponse} from "../../core/dto/resource-item.response";
import {PathVisibility} from "../../modules/path/enums/path-visibility";

export class PathResponse {
    id: string;
    name: string;
    description: string;
    path: LineStringDto;
    audit: AuditDto;
    images: Array<ResourceItemResponse>;
    isEditable: boolean;
    visibility: PathVisibility
}
