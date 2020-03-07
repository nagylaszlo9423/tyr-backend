import {GroupJoinPolicy} from "../../modules/group/enums/group-join-policy";
import {AuditDto} from "../../core/dto/audit.dto";


export class GroupResponse {
    id: string;
    name: string;
    description: string;
    joinPolicy: GroupJoinPolicy;
    owner: string;
    isEditable: boolean;
    isJoinEnabled: boolean;
    audit: AuditDto;
}
