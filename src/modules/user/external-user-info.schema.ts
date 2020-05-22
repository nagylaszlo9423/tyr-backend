import * as mongoose from 'mongoose';
import {SchemaDefinition} from 'mongoose';

export interface ExternalUserInfo extends mongoose.Document {
  externalId: string;
}

export const ExternalUserInfoSchemaDef: SchemaDefinition = {
  externalId: {type: String, unique: true}
};

export const ExternalUserInfoSchema = new mongoose.Schema(ExternalUserInfoSchemaDef);
