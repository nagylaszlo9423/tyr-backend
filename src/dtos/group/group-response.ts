import {GroupJoinPolicy} from "../../modules/group/group-join-policy";


export class GroupResponse {
    id: string;
    name: string;
    description: string;
    joinPolicy: GroupJoinPolicy;
    owner: string;
}

export namespace GroupResponse {

}
