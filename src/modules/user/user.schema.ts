import * as mongoose from 'mongoose';
import {UserRole} from "./user-role";
import {Schema} from "mongoose";
import {Route} from "../route/route.schema";
import {Group} from "../group/group.schema";

export interface User extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
  friends: User[] | string[];
  routes: Route[] | string[];
  groups: Group[] | string[];
}

export const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  role: {type:UserRole, required: true},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});
