import * as mongoose from 'mongoose';
import {Group} from "../group/group.schema";
import {Path} from "../path/path.schema";

export enum UserRole {
  USER = 'USER', ADMIN = 'ADMIN'
}

export interface User extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
  friends: User[] | string[];
  paths: Path[] | string[];
  groups: Group[] | string[];
}

export const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  role: {type: String, required: true, enum: ['USER', 'ADMIN'], default: 'USER'},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  paths: [{type: mongoose.Schema.Types.ObjectId, ref: 'Path'}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});
