import * as mongoose from "mongoose";
import {environment} from "../../environment/environment";
import {Schema} from "mongoose";
import {audit} from "rxjs/operators";

export interface Audit extends mongoose.Document {
  createdBy: string,
  createdAt: Date,
  modifiedBy: string,
  modifiedAt: Date
}

export const AuditSchema = new mongoose.Schema({
  createdBy: {type: String, required: true},
  createdAt: {type: Date, required: true},
  modifiedBy: {type: String, required: true},
  modifiedAt: {type: Date, required: true}
});
