import * as mongoose from "mongoose";
import {User} from "../user/user.schema";
import {Route} from "../route/route.schema";

export enum GroupAccess {
  INVITE_ONLY = 'INVITE_ONLY',
  REQUEST = 'REQUEST',
  PUBLIC = 'PUBLIC'
}

export interface Group extends mongoose.Document {
  name: string;
  description: string;
  access: GroupAccess;
  members: User[] | string[];
  routes: Route[] | string[];
}

export const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  access: {type: String, enum: ['INVITE_ONLY', 'REQUEST', 'PUBLIC'], required: true, default: 'INVITE_ONLY'},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  routes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Route'}]
});
