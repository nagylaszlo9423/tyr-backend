import * as mongoose from "mongoose";
import {AuditSchema, Audit} from "../../core/schemas/audit.schema";
import {User} from "../user/user.schema";
import {Group} from "../group/group.schema";
import {Auditable} from "../../core/util/auditable";
import {LineString, LineStringSchema} from "../../core/schemas/line-string.schema";
import {ResourceItem} from "../resource/resource-item.schema";
import {PathVisibility} from "./enums/path-visibility";
import {PathCategory} from "./enums/path-category";

export interface Path extends mongoose.Document, Auditable {
  name: string;
  description: string;
  owner: User | mongoose.Schema.Types.ObjectId;
  group: Group | mongoose.Schema.Types.ObjectId;
  images: ResourceItem[] | string[];
  visibility: PathVisibility;
  path: LineString;
  audit: Audit;
}

export const PathSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
  categories: [{type: Number, enum: Object.values(PathCategory)}],
  visibility: {type: Number, enum: Object.values(PathVisibility), required: true, default: 'PRIVATE'},
  path: LineStringSchema,
  audit: AuditSchema
}).index({title: 'text'});
