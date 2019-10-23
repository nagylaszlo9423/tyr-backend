import * as mongoose from "mongoose";
import {IPolygon, PolygonSchema} from "../../core/schemas/polygon.schema";
import {Audit, AuditSchema, IAudit} from "../../core/schemas/audit.schema";
import {IAuditable} from "../../core/schemas/auditable.schema";
import {User} from "../user/user.schema";
import {Group} from "../group/group.schema";

export enum RouteVisibility {
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

export interface Route extends mongoose.Document, IAuditable {
  title: string;
  description: string;
  owner: User | string;
  group: Group | string;
  visibility: RouteVisibility;
  path: IPolygon;
  audit: IAudit;
}

export const RouteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  group: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  state: {type: String, enum: ['PUBLIC', 'GROUP', 'PRIVATE'], required: true, default: 'PRIVATE'},
  path: PolygonSchema,
  audit: AuditSchema
});

Audit.beforeSave(RouteSchema);
