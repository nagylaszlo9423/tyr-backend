import * as mongoose from 'mongoose';

export interface IAccessToken extends mongoose.Document {
  token: string;
  clientId: string;
  userId: string;
  expirationDate: Date;
}

export const AccessTokenSchema = new mongoose.Schema({
  token: String,
  clientId: String,
  userId: String,
  expirationDate: Date
});
