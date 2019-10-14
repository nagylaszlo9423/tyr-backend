import * as mongoose from "mongoose";

export interface IPoint {
  type: 'Point';
  coordinates: number[];
}

export const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});
