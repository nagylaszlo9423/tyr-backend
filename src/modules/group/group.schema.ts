import * as mongoose from 'mongoose';
import {User} from '../user/user.schema';
import {GroupJoinPolicy} from './enums/group-join-policy';
import {Path} from '../path/path.schema';
import {Audit, AuditSchema} from '../../core/schemas/audit.schema';
import {Auditable} from '../../core/util/auditable';

export interface Group extends mongoose.Document, Auditable {
  name: string;
  description: string;
  joinPolicy: GroupJoinPolicy;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  paths: mongoose.Types.ObjectId[];
  audit: Audit;
}

export const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  joinPolicy: {type: Number, enum: Object.values(GroupJoinPolicy), required: true, default: GroupJoinPolicy.INVITE_ONLY},
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  paths: [{type: mongoose.Schema.Types.ObjectId, ref: 'Path'}],
  audit: AuditSchema,
}).index({name: 'text', joinPolicy: 1});
