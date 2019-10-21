import {Injectable} from "@nestjs/common";
import {BaseService} from "../../core/base.service";
import {Group} from "./group.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";


@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(@InjectModel('Group') model: Model<Group>) {
    super(model);
  }
}
