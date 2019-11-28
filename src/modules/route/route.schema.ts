import * as mongoose from "mongoose";
import {AuditSchema, Audit} from "../../core/schemas/audit.schema";
import {User} from "../user/user.schema";
import {Group} from "../group/group.schema";
import {Auditable} from "../../core/util/auditable";
import {LineString, LineStringSchema} from "../../core/schemas/line-string.schema";
import {ResourceItem} from "../resource/resource-item.schema";

export enum RouteVisibility {
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

export enum RouteCategory {
  BICYCLE = "BICYCLE",
  SIGHTSEEING ="SIGHTSEEING",
  HIKING = "HIKING",
  OFF_ROAD = "OFF_ROAD"
}

export interface Route extends mongoose.Document, Auditable {
  title: string;
  description: string;
  owner: User | string;
  group: Group | string;
  images: ResourceItem[] | string[];
  visibility: RouteVisibility;
  path: LineString;
  audit: Audit;
}

export const RouteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}],
  categories: [{type: String, enum: ['BICYCLE', 'SIGHTSEEING', 'HIKING', 'OFF_ROAD']}],
  visibility: {type: String, enum: ['PUBLIC', 'GROUP', 'PRIVATE'], required: true, default: 'PRIVATE'},
  path: LineStringSchema,
  audit: AuditSchema
});
