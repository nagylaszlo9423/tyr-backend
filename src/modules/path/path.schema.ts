import * as mongoose from "mongoose";
import {AuditSchema, Audit} from "../../core/schemas/audit.schema";
import {User} from "../user/user.schema";
import {Group} from "../group/group.schema";
import {Auditable} from "../../core/util/auditable";
import {LineString, LineStringSchema} from "../../core/schemas/line-string.schema";
import {ResourceItem} from "../resource/resource-item.schema";

export enum PathVisibility {
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

export enum PathCategory {
  BICYCLE = "BICYCLE",
  SIGHTSEEING ="SIGHTSEEING",
  HIKING = "HIKING",
  OFF_ROAD = "OFF_ROAD"
}

export interface Path extends mongoose.Document, Auditable {
  title: string;
  description: string;
  owner: User | mongoose.Schema.Types.ObjectId;
  group: Group | mongoose.Schema.Types.ObjectId;
  images: ResourceItem[] | string[];
  visibility: PathVisibility;
  path: LineString;
  audit: Audit;
}

export const PathSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
  categories: [{type: String, enum: ['BICYCLE', 'SIGHTSEEING', 'HIKING', 'OFF_ROAD']}],
  visibility: {type: String, enum: ['PUBLIC', 'GROUP', 'PRIVATE'], required: true, default: 'PRIVATE'},
  path: LineStringSchema,
  audit: AuditSchema
}).index({title: 1});
