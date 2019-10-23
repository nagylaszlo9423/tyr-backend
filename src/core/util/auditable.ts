import {Audit, AuditSchema} from "../schemas/audit.schema";
import {Schema} from "mongoose";
import * as mongoose from "mongoose";
import {environment} from "../../environment/environment";


export interface Auditable {
  audit: Audit
  _userId: string;
}

const AuditModel = mongoose.model<Audit>('Audit', AuditSchema, environment.collection);

export class AuditManager {
  static createAudit(userId: string): Audit {
    const audit: Audit = new AuditModel();
    audit.createdBy = userId;
    audit.createdAt = new Date();
    audit.modifiedBy = userId;
    audit.modifiedAt = new Date();
    return audit;
  }

  static modifyAudit(audit: Audit, userId: string) {
    audit.modifiedBy = userId;
    audit.modifiedAt = new Date();
  }

  static beforeSave(schema: Schema) {
    schema.pre('save', function (next, docs) {
      docs.forEach(doc => {
        if (doc['_userId']) {
          if (doc['audit']) {
            AuditManager.modifyAudit(doc.audit, doc['_userId'])
          } else {
            doc.audit = AuditManager.createAudit(doc['_userId'])
          }
        }
      });
      return next();
    })
  }
}
