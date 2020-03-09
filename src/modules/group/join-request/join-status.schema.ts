import * as mongoose from 'mongoose';
import {Audit, AuditSchema} from '../../../core/schemas/audit.schema';
import {Auditable} from '../../../core/util/auditable';
import {JoinStatus} from './join-status';
import {ModelNames} from '../../../db/model-names';

export interface JoinStatusDoc extends mongoose.Document, Auditable {
  group: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  audit: Audit;
  status: JoinStatus;
}

export const JoinStatusSchema = new mongoose.Schema({
  group: {type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Group, required: true},
  requester: {type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User, required: true},
  audit: AuditSchema,
  status: {type: Number, enum: Object.values(JoinStatus), required: true, default: JoinStatus.PENDING}
});
