import * as mongoose from "mongoose";
import {User} from "../user/user.schema";
import {Route} from "../route/route.schema";
import {GroupJoinPolicy} from "./group-join-policy";

export interface Group extends mongoose.Document {
  name: string;
  description: string;
  joinPolicy: GroupJoinPolicy;
  owner: User | string;
  members: User[] | string[];
  routes: Route[] | string[];
}

export const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  joinPolicy: {type: String, enum: Object.keys(GroupJoinPolicy), required: true, default: 'INVITE_ONLY'},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  routes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Route'}]
});
