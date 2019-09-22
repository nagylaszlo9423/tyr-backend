import * as mongoose from 'mongoose';

export interface IAuthorizationCode extends mongoose.Document {
  code: string;
  clientId: string;
  redirectUri: string;
  userId: string;
  expirationDate: Date;
}

export const AuthorizationCodeSchema = new mongoose.Schema({
  code: String,
  clientId: String,
  redirectUri: String,
  userId: String,
  expirationDate: Date
});
