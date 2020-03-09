import * as mongoose from 'mongoose';
import {Auditable} from '../../core/util/auditable';

export interface ResourceItem extends mongoose.Document, Auditable {
  url: string;
  name: string;
}

export const ResourceItemSchema = new mongoose.Schema({
  url: {type: String, required: true},
  name: {type: String, required: true}
});
