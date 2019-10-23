import {ObjectInitializer} from "../../core/util/object-initializer";


export class LoginResponse extends ObjectInitializer<LoginResponse> {
  code: string;
  redirectUri: string;
}
