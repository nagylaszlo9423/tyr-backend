import * as mongoose from "mongoose";
import {LocalizedContent, LocalizedContentSchema} from "../../core/schemas/localized-content.schema";
import {ResourceItem} from "../resource/resource-item.schema";

export interface Article {
  title: LocalizedContent<string>;
  text: LocalizedContent<string>;
  images: LocalizedContent<ResourceItem>;
}

export const ArticleSchema = new mongoose.Schema({
  title: {type: LocalizedContentSchema, required: true},
  text: {type: LocalizedContentSchema, required: true},
  images: {type: LocalizedContentSchema, required: true},
});
