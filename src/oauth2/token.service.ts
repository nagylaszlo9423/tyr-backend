import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IAccessToken} from "./schemas/access-token.shema";
import {AuthorizationCodeService} from "./authorization-code.service";
import {IRefreshToken} from "./schemas/refresh-token.schema";
import * as crypto from 'crypto';
import {environment} from "../environment/environment";


@Injectable()
export class TokenService {

  constructor(@InjectModel('RefreshToken') private refreshTokenModel: Model<IRefreshToken>,
              @InjectModel('AccessToken') private accessTokenModel: Model<IAccessToken>,
              private authCodeService: AuthorizationCodeService) {}

  async exchangeCode(code: string, clientId: string) {
    const userId = await this.authCodeService.getUserIdForAuthorizationCode(code);
    const accessToken = await this.createAccessToken(clientId, userId);
    const refreshToken = await this.createRefreshToken(accessToken.token, userId);

  }

  refreshToken(refreshToken: string) {

  }

  private createAccessToken(clientId: string, userId: string): Promise<IAccessToken> {
    const accessToken = new this.accessTokenModel();
    accessToken.clientId = clientId;
    accessToken.token = crypto.randomBytes(environment.accessToken.length).toString();
    accessToken.userId = userId;
    return accessToken.save();
  }

  private createRefreshToken(accessToken: string, userId: string): Promise<IRefreshToken> {
    const refreshToken = new this.refreshTokenModel();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + environment.refreshToken.expiresInMinutes);
    refreshToken.token = crypto.randomBytes(environment.refreshToken.length).toString();
    refreshToken.accessToken = accessToken;
    refreshToken.expirationDate = expirationDate;
    refreshToken.userId = userId;
    return refreshToken.save();
  }
}
