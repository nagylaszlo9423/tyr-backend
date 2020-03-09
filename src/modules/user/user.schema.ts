import * as mongoose from 'mongoose';
import {SchemaDefinition} from 'mongoose';
import {ModelNames} from '../../db/model-names';

export enum UserRole {
  USER = 'USER', ADMIN = 'ADMIN',
}

export interface User extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
  friends: mongoose.Types.ObjectId;
  paths: mongoose.Types.ObjectId;
  groups: mongoose.Types.ObjectId;
}

export const UserSchemaDef: SchemaDefinition = {
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, required: true, enum: ['USER', 'ADMIN'], default: 'USER'},
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.User}],
  paths: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Path}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: ModelNames.Group}],
};

export const UserSchema = new mongoose.Schema(UserSchemaDef);
