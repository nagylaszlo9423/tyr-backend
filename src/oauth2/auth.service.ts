import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IAuthorizationCode} from "./schemas/authorization-code.schema";
import {IAccessToken} from "./schemas/access-token.shema";
import {LoginRequest} from "../api/oauth2/login.request";
import {TokenRequest} from "../api/oauth2/token.request";

@Injectable()
export class AuthService {

  constructor(@InjectModel('AuthorizationCode') private authorizationModel: Model<IAuthorizationCode>,
              @InjectModel('AccessToken') private accessTokenModel: Model<IAccessToken>) {
  }

  login(request: LoginRequest) {

  }

  token(request: TokenRequest) {

  }

  private createAccessToken(token: string, clientId: string, userId: string, scope: string) {
    const accessToken = new this.accessTokenModel();
    accessToken.clientId = clientId;
    accessToken.token = token;
    accessToken.userId = userId;
    accessToken.scope = scope;
    return accessToken;
  }

  private createAuthorizationCode(code: string, clientId: string, redirectUri: string, userId: string, scope: string): IAuthorizationCode {
    const authCode = new this.authorizationModel();
    authCode.clientId = clientId;
    authCode.redirectUri = redirectUri;
    authCode.code = code;
    authCode.userId = userId;
    authCode.scope = scope;
    return authCode;
  }
}
