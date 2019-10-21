import * as mongoose from "mongoose";
import {environment} from "../../environment/environment";
import {Schema} from "mongoose";
import {IAuditable} from "./auditable.schema";
import {audit} from "rxjs/operators";

export interface IAudit extends mongoose.Document {
  createdBy: string,
  createdAt: Date,
  modifiedBy: string,
  modifiedAt: Date
}

export const AuditSchema = new mongoose.Schema({
  createdBy: {tpye: String, required: true},
  createdAt: {type: Date, required: true},
  modifiedBy: {tpye: String, required: true},
  modifiedAt: {type: Date, required: true}
});

const AuditModel = mongoose.model<IAudit>('audit', AuditSchema, environment.collection);

export class Audit {
  static createAudit(userId: string): IAudit {
    const audit: IAudit = new AuditModel();
    audit.createdBy = userId;
    audit.createdAt = new Date();
    audit.modifiedBy = userId;
    audit.modifiedAt = new Date();
    return audit;
  }

  static modifyAudit(audit: IAudit, userId: string) {
    audit.modifiedBy = userId;
    audit.modifiedAt = new Date();
  }

  static beforeSave(schema: Schema) {
    schema.pre('save', function (next, docs) {
      docs.forEach(doc => {
        if (doc['_userId']) {
          if (doc['audit']) {
            Audit.modifyAudit(doc.audit, this['_userId'])
          } else {
            doc.audit = Audit.createAudit(this['_userId'])
          }
        }
      });
      return next();
    })
  }
}

