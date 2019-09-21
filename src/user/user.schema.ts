import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
}

export const UserSchema = new mongoose.Schema({
  email: String,
  password: String
});
