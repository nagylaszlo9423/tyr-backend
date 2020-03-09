import {JoinStatusDoc} from './join-status.schema';
import {JoinStatusResponse} from '../../../dtos/group/join-status.response';
import {UserMapper} from '../../user/user.mapper';
import {AuditMapper} from '../../../core/util/audit.mapper';

export class JoinStatusMapper {

  private constructor() {}

  static modelToResponse(doc: JoinStatusDoc): JoinStatusResponse {
    return new JoinStatusResponse({
      groupId: doc.group.toString(),
      requesterId: doc.requester.toString(),
      status: doc.status,
      audit: AuditMapper.modelToResponse(doc.audit),
      user: UserMapper.modelToPublicUserResponse(doc.requester)
    });
  }

}
