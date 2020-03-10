import * as mongoose from 'mongoose';
import {GroupJoinPolicy} from './enums/group-join-policy';
import {Audit, AuditSchema} from '../../core/schemas/audit.schema';
import {Auditable} from '../../core/util/auditable';
import {ModelNames} from '../../db/model-names';

export interface GroupDoc extends mongoose.Document, Auditable {
  name: string;
  description: string;
  joinPolicy: GroupJoinPolicy;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  bannedUsers: mongoose.Types.ObjectId[];
  paths: mongoose.Types.ObjectId[];
  audit: Audit;
}

export const GroupSchemaDoc = {
  name: String,
  description: String,
  joinPolicy: {type: Number, enum: Object.values(GroupJoinPolicy), required: true, default: GroupJoinPolicy.CLOSED},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User}],
  bannedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User}],
  paths: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Path}],
  audit: AuditSchema,
};

export const GroupSchema = new mongoose.Schema(GroupSchemaDoc).index({name: 'text', joinPolicy: 1});
