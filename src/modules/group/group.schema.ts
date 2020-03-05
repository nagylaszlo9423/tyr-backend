import * as mongoose from "mongoose";
import {User} from "../user/user.schema";
import {GroupJoinPolicy} from "./enums/group-join-policy";
import {Path} from "../path/path.schema";

export interface Group extends mongoose.Document {
  name: string;
  description: string;
  joinPolicy: GroupJoinPolicy;
  owner: User | string;
  members: User[] | string[];
  paths: Path[] | string[];
}

export const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  joinPolicy: {type: Number, enum: Object.values(GroupJoinPolicy), required: true, default: GroupJoinPolicy.INVITE_ONLY},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  paths: [{type: mongoose.Schema.Types.ObjectId, ref: 'Path'}]
}).index({name: 'text', joinPolicy: 1});
