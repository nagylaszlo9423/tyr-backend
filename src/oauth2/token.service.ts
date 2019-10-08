import {Injectable, Logger} from "@nestjs/common";
import {AccessToken} from "./schemas/access-token.shema";
import {RefreshToken} from "./schemas/refresh-token.schema";
import * as crypto from 'crypto';
import {environment} from "../environment/environment";
import {GeneralException} from "../api/errors/errors";
import {TokenResponse} from "../api/oauth2/token.response";
import {RedisService} from "../core/redis.service";


@Injectable()
export class TokenService {

  private static readonly accessTokenExpiresInSeconds = environment.accessToken.expiresInMinutes * 60;
  private static readonly refreshTokenExpiresInSeconds = environment.refreshToken.expiresInMinutes * 60;

  constructor(private redisService: RedisService) {}

  async renewToken(refreshTokenValue: string): Promise<TokenResponse> {
    const refreshToken: RefreshToken = await this.redisService.getToken(refreshTokenValue, 'refresh');
    const accessToken: AccessToken = await this.redisService.getToken(refreshToken.value, 'access');
    if (refreshToken.expirationDate < new Date()) {
      throw new GeneralException("INVALID_TOKEN");
    }
    const userId = accessToken.userId;
    const clientId = accessToken.clientId;

    await this.redisService.removeToken(accessToken.value, 'access');
    await this.redisService.removeToken(refreshToken.value, 'refresh');

    return this.createTokens(userId, clientId);
  }

  async createTokens(userId: string, clientId: string) {
    const accessToken = TokenService.createAccessToken(clientId, userId);
    const accessTokenHashedKey = await this.redisService.addTokenAndSetExpiration(accessToken.value, accessToken, 'access', TokenService.accessTokenExpiresInSeconds);
    const refreshToken = TokenService.createRefreshToken(accessTokenHashedKey);
    await this.redisService.addTokenAndSetExpiration([accessToken.value, userId], refreshToken, 'refresh', TokenService.refreshTokenExpiresInSeconds);
    return new TokenResponse({
      accessToken: accessToken.value,
      accessTokenExpiration: accessToken.expirationDate,
      refreshToken: refreshToken.value,
      refreshTokenExpiration: refreshToken.expirationDate
    });
  }

  async removeTokens(accessToken: string) {
    const userId = (await this.redisService.getToken(accessToken, 'access')).value;
    await this.redisService.removeToken(accessToken, 'access');
    await this.redisService.removeToken([accessToken, userId], 'refresh');
  }

  private static createAccessToken(clientId: string, userId: string): AccessToken {
    const accessToken = new AccessToken();
    accessToken.clientId = clientId;
    accessToken.value = crypto.randomBytes(environment.accessToken.length).toString('hex');
    accessToken.userId = userId;
    return accessToken;
  }

  private static createRefreshToken(userId: string): RefreshToken {
    const refreshToken = new RefreshToken();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + environment.refreshToken.expiresInMinutes);
    refreshToken.value = crypto.randomBytes(environment.refreshToken.length).toString('hex');
    refreshToken.expirationDate = expirationDate;
    refreshToken.userId = userId;
    return refreshToken;
  }
}
