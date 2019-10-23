import * as mongoose from 'mongoose';
import {Route} from "../route/route.schema";
import {Group} from "../group/group.schema";

export enum UserRole {
  USER = 'USER', ADMIN = 'ADMIN'
}

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
  role: {type: String, required: true, enum: ['USER', 'ADMIN'], default: 'USER'},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  routes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Route'}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});
