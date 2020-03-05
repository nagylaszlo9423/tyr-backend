import {GroupJoinPolicy} from "../../modules/group/enums/group-join-policy";
import {IsEnum} from "class-validator";


export class GroupRequest {
    name: string;
    description: string;

    @IsEnum(Object.keys(GroupJoinPolicy))
    joinPolicy: GroupJoinPolicy;
}
