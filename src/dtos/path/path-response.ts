import {LineStringDto} from "./line-string.dto";
import {AuditDto} from "../../core/dto/audit.dto";
import {ResourceItemResponse} from "../../core/dto/resource-item.response";

export class PathResponse {
    id: string;
    title: string;
    description: string;
    path: LineStringDto;
    audit: AuditDto;
    images: Array<ResourceItemResponse>;
    isEditable: boolean;
}
