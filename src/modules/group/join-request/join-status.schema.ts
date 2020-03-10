import * as mongoose from 'mongoose';
import {Audit, AuditSchema} from '../../../core/schemas/audit.schema';
import {Auditable} from '../../../core/util/auditable';
import {JoinStatus} from '../enums/join-status';
import {ModelNames} from '../../../db/model-names';

export interface JoinStatusDoc extends mongoose.Document, Auditable {
  group: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  audit: Audit;
  status: JoinStatus;
}

export const JoinStatusSchema = new mongoose.Schema({
  group: {type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Group, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User, required: true},
  audit: AuditSchema,
  status: {type: Number, enum: Object.values(JoinStatus), required: true, default: JoinStatus.PENDING}
}).index({group: 1, user: 1}, {unique: true});
