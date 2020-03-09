import {ObjectInitializer} from '../../core/util/object-initializer';
import {JoinStatus} from '../../modules/group/join-request/join-status';
import {PublicUserResponse} from '../user/public-user.response';
import {AuditDto} from '../../core/dto/audit.dto';

export class JoinStatusResponse extends ObjectInitializer<JoinStatusResponse> {
  groupId: string;
  requesterId: string;
  status: JoinStatus;
  user: PublicUserResponse;
  audit: AuditDto;
}
