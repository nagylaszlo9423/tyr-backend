import {Audit, AuditSchema} from "../schemas/audit.schema";
import * as mongoose from "mongoose";
import {environment} from "../../environment/environment";


export interface Auditable {
  audit: Audit
  _userId: string;
}

const AuditModel = mongoose.model<Audit>('Audit', AuditSchema, environment.db);

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
}
