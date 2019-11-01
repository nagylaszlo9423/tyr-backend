import * as mongoose from "mongoose";
import {FeatureType} from "../feature-type.enum";

export interface Point {
  type: FeatureType.POINT;
  coordinates: number[];
}

export const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [FeatureType.POINT],
    required: true,
    default: FeatureType.POINT
  },
  coordinates: {
    type: [Number],
    required: true
  }
});
