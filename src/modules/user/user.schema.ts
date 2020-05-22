import * as mongoose from 'mongoose';
import {SchemaDefinition} from 'mongoose';
import {ModelNames} from '../../db/model-names';
import {ExternalUserInfo} from './external-user-info.schema';

export enum UserRole {
  USER = 'USER', ADMIN = 'ADMIN',
}

export interface User extends mongoose.Document {
  email: string;
  password: string;
  picture: string;
  role: UserRole;
  friends: mongoose.Types.ObjectId[];
  paths: mongoose.Types.ObjectId[];
  groups: mongoose.Types.ObjectId[];
  externalUserInfo: ExternalUserInfo;
}

export const UserSchemaDef: SchemaDefinition = {
  email: {type: String, required: true, unique: true},
  password: {type: String},
  picture: {type: String},
  role: {type: String, required: true, enum: ['USER', 'ADMIN'], default: 'USER'},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User}],
  paths: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Path}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Group}],
  externalUserInfo: {type: mongoose.Schema.Types.ObjectId, ref: ModelNames.ExternalUserInfo}
};

export const UserSchema = new mongoose.Schema(UserSchemaDef);
