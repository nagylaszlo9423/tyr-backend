import {LineStringDto} from "./line-string.dto";
import {AuditDto} from "../../core/dto/audit.dto";
import {ResourceItemResponse} from "../../core/dto/resource-item.response";
import {PathVisibility} from "../../modules/path/path.schema";

export class PathResponse {
    id: string;
    title: string;
    description: string;
    path: LineStringDto;
    audit: AuditDto;
    images: Array<ResourceItemResponse>;
    isEditable: boolean;
    visibility: PathVisibility
}
