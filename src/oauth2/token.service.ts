import {Injectable, Logger} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {IAccessToken} from "./schemas/access-token.shema";
import {IRefreshToken} from "./schemas/refresh-token.schema";
import * as crypto from 'crypto';
import {environment} from "../environment/environment";
import {InvalidTokenException} from "../api/errors/errors";
import {TokenResponse} from "../api/oauth2/token.response";
import {Interval, NestSchedule} from "nest-schedule";


@Injectable()
export class TokenService extends NestSchedule {

  constructor(@InjectModel('RefreshToken') private refreshTokenModel: Model<IRefreshToken>,
              @InjectModel('AccessToken') private accessTokenModel: Model<IAccessToken>,
              private logger: Logger) {
    super();
  }

  async renewToken(token: string): Promise<TokenResponse> {
    const refreshToken = await this.refreshTokenModel.findOne({token: token}).exec();
    const accessToken = await this.accessTokenModel.findOne({token: refreshToken.token}).exec();
    if (refreshToken.expirationDate < new Date()) {
      throw new InvalidTokenException();
    }
    const userId = accessToken.userId;
    const clientId = accessToken.clientId;
    await accessToken.remove();
    await refreshToken.remove();
    return this.createTokens(userId, clientId);
  }

  async createTokens(userId: string, clientId: string) {
    const accessToken = await this.createAccessToken(clientId, userId);
    const refreshToken = await this.createRefreshToken(accessToken.token, userId);
    return new TokenResponse({
      accessToken: accessToken.token,
      accessTokenExpiration: accessToken.expirationDate,
      refreshToken: refreshToken.token,
      refreshTokenExpiration: refreshToken.expirationDate
    });
  }

  private createAccessToken(clientId: string, userId: string): Promise<IAccessToken> {
    const accessToken = new this.accessTokenModel();
    accessToken.clientId = clientId;
    accessToken.token = crypto.randomBytes(environment.accessToken.length).toString('hex');
    accessToken.userId = userId;
    return accessToken.save();
  }

  private createRefreshToken(accessToken: string, userId: string): Promise<IRefreshToken> {
    const refreshToken = new this.refreshTokenModel();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + environment.refreshToken.expiresInMinutes);
    refreshToken.token = crypto.randomBytes(environment.refreshToken.length).toString('hex');
    refreshToken.accessToken = accessToken;
    refreshToken.expirationDate = expirationDate;
    refreshToken.userId = userId;
    return refreshToken.save();
  }

  @Interval(environment.accessToken.autoCleanInMillis)
  async deleteExpiredAccessTokens() {
    this.logger.log('Deleting expired access tokens...');
    await this.accessTokenModel.deleteMany({expirationDate: {$lt: new Date()}}).exec();
    this.logger.log('Deleted expired access tokens');
  }

  @Interval(environment.refreshToken.autoCleanInMillis)
  async deleteExpiredRefreshToken() {
    this.logger.log('Deleting expired refresh tokens...');
    await this.refreshTokenModel.deleteMany({expirationDate: {$lt: new Date()}}).exec();
    this.logger.log('Deleted expired refresh tokens');
  }
}
