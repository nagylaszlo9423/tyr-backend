import {ObjectInitializer} from "../../core/util/ObjectInitializer";


export class LoginResponse extends ObjectInitializer<LoginResponse> {
  code: string;
  redirectUri: string;
}
