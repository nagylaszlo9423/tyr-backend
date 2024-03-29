import {Audit} from '../schemas/audit.schema';
import {AuditDto} from '../../dtos/audit.dto';

export class AuditMapper {
  static modelToResponse(model: Audit): AuditDto {
    const response = new AuditDto();

    if (model) {
      response.createdAt = model.createdAt?.toISOString();
      response.createdBy = model.createdBy;
      response.modifiedAt = model.modifiedAt?.toISOString();
      response.modifiedBy = model.modifiedBy;
    }

    return response;
  }
}
