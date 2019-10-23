import * as mongoose from "mongoose";
import {Schema} from "mongoose";


export interface LocalizedContent<T> {
  content: {[key: string] : T};
  default: T;
}

export const LocalizedContentSchema = new mongoose.Schema({
  content: {type: Schema.Types.Map, of: Schema.Types.Mixed},
  default: Schema.Types.Mixed
});
