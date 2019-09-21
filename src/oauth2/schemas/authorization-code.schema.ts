import * as mongoose from 'mongoose';

export interface IAuthorizationCode extends mongoose.Document {
  code: string;
  clientId: string;
  redirectUri: string;
  userId: string;
  scope: string;
}

export const AuthorizationCodeSchema = new mongoose.Schema({
  code: String,
  clientId: String,
  redirectUri: String,
  userId: String,
  scope: String,
});
