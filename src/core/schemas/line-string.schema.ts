import * as mongoose from "mongoose";
import {FeatureType} from "../feature-type.enum";

export interface LineString extends mongoose.Document {
  type: FeatureType.LINE_STRING;
  coordinates: number[][];
}

export const LineStringSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [FeatureType.LINE_STRING],
    required: true,
    default: FeatureType.LINE_STRING
  },
  coordinates: {
    type: [[Number]],
    required: true
  }
});
