import * as mongoose from "mongoose";
import {FeatureType} from "../feature-type.enum";

export interface Polygon {
  type: FeatureType.POLYGON;
  coordinates: string[][][];
}

export const PolygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [FeatureType.POLYGON],
    required: true,
    default: FeatureType.POLYGON
  },
  coordinates: {
    type: [[[Number]]],
    required: true
  }
});
