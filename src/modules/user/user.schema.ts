import * as mongoose from 'mongoose';
import {UserRole} from "./userRole";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
  friends: string[];
  routes: string[];
  groups: string[];
}

export const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  role: {type:UserRole, required: true},
  friends: [String],
  routes: [String],
  groups: [String]
});
