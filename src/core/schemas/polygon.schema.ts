import * as mongoose from "mongoose";

export interface IPolygon {
  type: 'Polygon';
  coordinates: string[][][];
}

export const PolygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Polygon'],
    required: true
  },
  coordinates: {
    type: [[[Number]]],
    required: true
  }
});
