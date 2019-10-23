import * as mongoose from "mongoose";
import {Polygon, PolygonSchema} from "../../core/schemas/polygon.schema";
import {AuditSchema, Audit} from "../../core/schemas/audit.schema";
import {User} from "../user/user.schema";
import {Group} from "../group/group.schema";
import {Auditable, AuditManager} from "../../core/util/auditable";

export enum RouteVisibility {
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

export interface Route extends mongoose.Document, Auditable {
  title: string;
  description: string;
  owner: User | string;
  group: Group | string;
  visibility: RouteVisibility;
  path: Polygon;
  audit: Audit;
}

export const RouteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  visibility: {type: String, enum: ['PUBLIC', 'GROUP', 'PRIVATE'], required: true, default: 'PRIVATE'},
  path: PolygonSchema,
  audit: AuditSchema
});

AuditManager.beforeSave(RouteSchema);
