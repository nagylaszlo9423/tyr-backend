import {HttpService, Injectable} from '@nestjs/common';
import {AuthCodeExchangeMessage} from '../messages/auth-code-exchange.message';
import {TokenResponse} from '../../../dtos/auth/token-response';
import {FacebookTokenResponse} from '../../../dtos/auth/facebook/facebook-token.response';
import {FacebookUserInfoResponse} from '../../../dtos/auth/facebook/facebook-user-info.response';
import {UserService} from '../../user/user.service';
import {RegisterGoogleUserMessage} from '../../user/messages/register-google-user.message';
import {TokenService} from '../token.service';
import {RedisService} from '../../../core/security/redis.service';
import {GeneralException} from '../../../core/errors/exceptions';
import {GeneralCause} from '../../../core/errors/cause/general.cause';
import {environment} from '../../../environment/environment';
import * as crypto from 'crypto';

@Injectable()
export class FacebookOauthService {
  private static readonly hashAlgorithm = 'sha256';

  constructor(private httpService: HttpService,
              private userService: UserService,
              private tokenService: TokenService,
              private redisService: RedisService) {
  }

  async registerOrLoginSocialUser(message: AuthCodeExchangeMessage): Promise<TokenResponse> {
    const externalTokens = await this.exchangeAuthCode(message);
    const userInfo = await this.getUserInfo(externalTokens.access_token);
    const result = await this.userService.registerOrLoginGoogleUser(this.mapUserInfoToRegistrationMessage(userInfo));
    const tokens = await this.tokenService.createTokens(result.userId, message.clientId);

    await this.redisService.addTokenAndSetExpiration(tokens.accessToken, {value: externalTokens.access_token}, 'access:facebook', Number(externalTokens.expires_in));

    return tokens;
  }

  async exchangeAuthCode(message: AuthCodeExchangeMessage): Promise<FacebookTokenResponse> {
    try {
      return this.httpService.get<FacebookTokenResponse>(this.getTokenUrl(message)).toPromise().then(_ => _.data);
    } catch (e) {
      throw new GeneralException(GeneralCause.DEPENDANT_SERVICE_ERROR);
    }
  }

  async getUserInfo(accessToken: string): Promise<FacebookUserInfoResponse> {
    try {
      return await this.httpService.get<FacebookUserInfoResponse>(this.getUserInfoUrl(accessToken)).toPromise().then(_ => _.data);
    } catch (e) {
      throw new GeneralException(GeneralCause.DEPENDANT_SERVICE_ERROR);
    }
  }

  private mapUserInfoToRegistrationMessage(userInfo: FacebookUserInfoResponse): RegisterGoogleUserMessage {
    return {
      externalId: userInfo.id,
      email: userInfo.email,
      picture: userInfo.profile_pic
    };
  }

  private getTokenUrl(message: AuthCodeExchangeMessage): string {
    return `https://graph.facebook.com/v7.0/oauth/access_token?` +
      `client_id=${message.clientId}&` +
      `client_secret=${environment.security.oauth.facebook.clientSecret}&` +
      `redirect_uri=${message.redirectUri}&` +
      `code=${message.code}`;
  }

  private getUserInfoUrl(accessToken: string): string {
    return `https://graph.facebook.com/me?fields=name,id,email,picture.type(large)&access_token=${accessToken}&appsecret_proof=${this.getAppSecretProof(accessToken)}`;
  }

  private getAppSecretProof(accessToken: string): string {
    return crypto.createHmac(FacebookOauthService.hashAlgorithm, environment.security.oauth.facebook.clientSecret).update(accessToken).digest('hex');
  }

}
