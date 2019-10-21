import * as mongoose from "mongoose";
import {User} from "../user/user.schema";

export interface Group extends mongoose.Document {
  name: string;
  description: string;
  users: User[] | string[];
}

export const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  routes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Route'}]
});
