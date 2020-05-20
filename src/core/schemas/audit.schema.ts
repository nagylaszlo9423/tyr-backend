import * as mongoose from 'mongoose';

export interface Audit extends mongoose.Document {
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
}

export const AuditSchema = new mongoose.Schema({
  createdBy: {type: String, required: true},
  createdAt: {type: Date, required: true},
  modifiedBy: {type: String, required: true},
  modifiedAt: {type: Date, required: true}
});
