import * as mongoose from 'mongoose';
import {Document} from 'mongoose';

export function getDocumentId<S extends Document>(field: S | mongoose.Types.ObjectId | string): string {
  if (field instanceof mongoose.Types.ObjectId) {
    return field.toString();
  } else if (typeof field === 'object') {
    if (field['_id']) {
      return (field as S)._id.toString();
    } else {
      return field.toString();
    }
  } else {
    return field as string;
  }
}
