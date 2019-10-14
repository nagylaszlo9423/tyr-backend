import * as mongoose from "mongoose";
import {IPolygon, PolygonSchema} from "../../core/schemas/polygon.schema";
import {AuditSchema, IAudit} from "../../core/schemas/audit.schema";

export enum RouteState {
  PUBLIC = 'Public',
  GROUP = 'Group',
  PRIVATE = 'Private'
}

export interface IRoute extends mongoose.Document {
  title: string,
  description: string,
  state: RouteState,
  path: IPolygon,
  audit: IAudit
}

export const RouteSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  state: {type: String, enum: ['Public', 'Group', 'Private'], required: true, default: 'Private'},
  path: PolygonSchema,
  audit: AuditSchema
});
