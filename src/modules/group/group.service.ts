import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/base.service";
import {Group} from "./group.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {CreateGroupRequest} from "../../api/group/CreateGroupRequest";
import {UpdateGroupRequest} from "../../api/group/UpdateGroupRequest";


@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>) {
    super(model);
  }

  async create(createRequest: CreateGroupRequest, userId: string): Promise<string> {
    return Promise.resolve('');
  }

  async update(updateRequest: UpdateGroupRequest, userId: string): Promise<void> {
    return Promise.resolve();
  }


}
