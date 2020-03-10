import {ObjectInitializer} from '../../core/util/object-initializer';

export interface ProfileInfoResponse extends ObjectInitializer<ProfileInfoResponse> {
  id: string;
  email: string;
}
