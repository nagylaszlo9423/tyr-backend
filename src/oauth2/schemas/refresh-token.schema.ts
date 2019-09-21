import * as mongoose from 'mongoose';

export interface IRefreshToken extends mongoose.Document {
  token: string;
  accessToken: string;
  expirationDate: Date;
}

export const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  accessToken: String,
  expirationDate: Date
});
