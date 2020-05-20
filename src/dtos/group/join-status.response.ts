import {ObjectInitializer} from '../../core/util/object-initializer';
import {JoinStatus} from '../../modules/group/enums/join-status';
import {PublicUserResponse} from '../user/public-user.response';
import {AuditDto} from '../audit.dto';

export class JoinStatusResponse extends ObjectInitializer<JoinStatusResponse> {
  groupId: string;
  userId: string;
  status: JoinStatus;
  user: PublicUserResponse;
  audit: AuditDto;
}
