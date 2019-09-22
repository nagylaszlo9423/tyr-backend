import {ObjectInitializer} from "../../core/util/ObjectInitializer";


export class TokenResponse extends ObjectInitializer<TokenResponse> {
  accessToken: string;
  accessTokenExpiration: Date;
  refreshToken: string;
  refreshTokenExpiration: Date;
}
