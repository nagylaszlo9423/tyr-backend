import {HttpService, Injectable} from '@nestjs/common';
import {AuthCodeExchangeMessage} from '../messages/auth-code-exchange.message';
import {TokenResponse} from '../../../dtos/auth/token-response';
import {FacebookTokenResponse} from '../../../dtos/auth/facebook-token.response';
import {FacebookUserInfoResponse} from '../../../dtos/auth/facebook-user-info.response';
import {UserService} from '../../user/user.service';
import {RegisterGoogleUserMessage} from '../../user/messages/register-google-user.message';
import {TokenService} from '../token.service';
import {RedisService} from '../../../core/security/redis.service';

@Injectable()
export class FacebookOauthService {

  constructor(private httpService: HttpService,
              private userService: UserService,
              private tokenService: TokenService,
              private redisService: RedisService) {}

  async registerOrLoginSocialUser(message: AuthCodeExchangeMessage): Promise<TokenResponse> {
    const externalTokens = await this.exchangeAuthCode(message);
    const userInfo = await this.getUserInfo(externalTokens.access_token);
    const result = await this.userService.registerOrLoginGoogleUser(this.mapUserInfoToRegistrationMessage(userInfo));
    const tokens = await this.tokenService.createTokens(result.userId, message.clientId);

    await this.redisService.addTokenAndSetExpiration(tokens.accessToken, {value: externalTokens.access_token}, 'access:facebook', Number(externalTokens.expires_in));

    return tokens;
  }

  async exchangeAuthCode(message: AuthCodeExchangeMessage): Promise<FacebookTokenResponse> {
    const response = await this.httpService.post<FacebookTokenResponse>(
      `https://www.facebook.com/v7.0/dialog/oauth?` +
      `client_id=${message.clientId}&` +
      `redirect_uri=${message.redirectUri}&` +
      `code=${message.code}`
    ).toPromise();

    return response.data;
  }

  async getUserInfo(accessToken: string): Promise<FacebookUserInfoResponse> {
    const response = await this.httpService.get<FacebookUserInfoResponse>(
      `https://graph.facebook.com/me?fields=name,id,email,profile_pic&access_token=${accessToken}`
    ).toPromise();

    return response.data;
  }

  private mapUserInfoToRegistrationMessage(userInfo: FacebookUserInfoResponse): RegisterGoogleUserMessage {
    return {
      externalId: userInfo.id,
      email: userInfo.email,
      picture: userInfo.profile_pic
    };
  }

}
