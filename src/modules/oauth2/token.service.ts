import {Injectable} from '@nestjs/common';
import {AccessToken} from './schemas/access-token.shema';
import {RefreshToken} from './schemas/refresh-token.schema';
import * as crypto from 'crypto';
import {environment} from '../../environment/environment';
import {GeneralException} from '../../core/errors/exceptions';
import {RedisService} from '../../core/security/redis.service';
import {TokenResponse} from '../../dtos/auth/token-response';
import {AuthCause} from '../../core/errors/cause/auth.cause';

@Injectable()
export class TokenService {

  private static readonly accessTokenExpiresInSeconds = environment.security.accessToken.expiresInMinutes * 60;
  private static readonly refreshTokenExpiresInSeconds = environment.security.refreshToken.expiresInMinutes * 60;

  constructor(private redisService: RedisService) {
  }

  async renewToken(refreshTokenValue: string): Promise<TokenResponse> {
    const refreshToken: RefreshToken = await this.redisService.getToken(refreshTokenValue, 'refresh');
    const accessToken: AccessToken = await this.redisService.getToken(refreshToken.value, 'access');
    if (refreshToken.expirationDate < new Date()) {
      throw new GeneralException(AuthCause.INVALID_TOKEN);
    }
    const userId = accessToken.userId;
    const clientId = accessToken.clientId;

    await this.redisService.removeToken(accessToken.value, 'access');
    await this.redisService.removeToken(refreshToken.value, 'refresh');

    return this.createTokens(userId, clientId);
  }

  async createTokens(userId: string, clientId: string): Promise<TokenResponse> {
    const accessToken = TokenService.createAccessToken('', clientId, userId);
    const refreshToken = TokenService.createRefreshToken(accessToken.value, userId);
    accessToken.refreshTokenValue = refreshToken.value;
    await this.redisService.addTokenAndSetExpiration(accessToken.value, accessToken, 'access', TokenService.accessTokenExpiresInSeconds);
    await this.redisService.addTokenAndSetExpiration(refreshToken.value, refreshToken, 'refresh', TokenService.refreshTokenExpiresInSeconds);
    return TokenService.mapToResponse(accessToken, refreshToken);
  }

  removeAccessToken(accessToken: string): Promise<void> {
    return this.redisService.removeToken(accessToken, 'access');
  }

  async removeTokens(accessTokenValue: string) {
    const accessToken: AccessToken = await this.redisService.getToken(accessTokenValue, 'access');
    await this.redisService.removeToken(accessToken.refreshTokenValue, 'refresh');
    await this.redisService.removeToken(accessToken.value, 'access');
  }

  private static createAccessToken(refreshTokenValue: string, clientId: string, userId: string): AccessToken {
    const accessToken = new AccessToken();
    accessToken.clientId = clientId;
    accessToken.value = crypto.randomBytes(environment.security.accessToken.length).toString('hex');
    accessToken.userId = userId;
    accessToken.refreshTokenValue = refreshTokenValue;
    return accessToken;
  }

  private static createRefreshToken(accessTokenValue: string, userId: string): RefreshToken {
    const refreshToken = new RefreshToken();
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + environment.security.refreshToken.expiresInMinutes);
    refreshToken.value = crypto.randomBytes(environment.security.refreshToken.length).toString('hex');
    refreshToken.expirationDate = expirationDate;
    refreshToken.userId = userId;
    refreshToken.accessTokenValue = accessTokenValue;
    return refreshToken;
  }

  private static mapToResponse(accessToken: AccessToken, refreshToken: RefreshToken) {
    const response = new TokenResponse();
    response.accessToken = accessToken.value;
    response.accessTokenExpiration = accessToken.expirationDate.toISOString();
    response.refreshToken = refreshToken.value;
    response.refreshTokenExpiration = refreshToken.expirationDate.toISOString();
    return response;
  }
}
