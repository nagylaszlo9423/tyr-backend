import * as mongoose from 'mongoose';
import {SchemaDefinition} from 'mongoose';

export interface ExternalUserInfo extends mongoose.Document {
  id: string;
}

export const ExternalUserInfoSchemaDef: SchemaDefinition = {
  id: {type: String, unique: true}
};

export const ExternalUserInfoSchema = new mongoose.Schema(ExternalUserInfoSchemaDef);
