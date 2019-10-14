import * as mongoose from "mongoose";
import {environment} from "../../environment/environment";

export interface IAudit extends mongoose.Document{
  createdBy: string,
  createdAt: Date,
  modifiedBy: string,
  modifiedAt: Date
}

export const AuditSchema = new mongoose.Schema({
  createdBy: {tpye: String, required: true},
  createdAt: {type: Date, required: true},
  modifiedBy: {tpye: String, required: true},
  modifiedAt: {type: Date, required: true}
});

const AuditModel = mongoose.model<IAudit>('audit', AuditSchema, environment.collection);

export async function createAudit(userId: string): Promise<IAudit> {
  const audit: IAudit = new AuditModel();
  audit.createdBy = userId;
  audit.createdAt = new Date();
  audit.modifiedBy = userId;
  audit.modifiedAt = new Date();
  return audit.save();
}

export async function modifyAudit(audit: IAudit, userId: string): Promise<IAudit> {
  audit.modifiedBy = userId;
  audit.modifiedAt = new Date();
  return audit.save();
}
