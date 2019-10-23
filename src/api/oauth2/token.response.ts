import {ObjectInitializer} from "../../core/util/object-initializer";


export class TokenResponse extends ObjectInitializer<TokenResponse> {
  accessToken: string;
  accessTokenExpiration: Date;
  refreshToken: string;
  refreshTokenExpiration: Date;
}
