import {HttpService, Injectable} from '@nestjs/common';
import {AuthCodeExchangeMessage} from '../messages/auth-code-exchange.message';
import {environment} from '../../../environment/environment';
import {GoogleTokenResponse} from '../../../dtos/auth/google/google-token.response';
import {GoogleUserInfoResponse} from '../../../dtos/auth/google/google-user-info.response';
import {UserService} from '../../user/user.service';
import {RegisterGoogleUserMessage} from '../../user/messages/register-google-user.message';
import {RedisService} from '../../../core/security/redis.service';
import {TokenResponse} from '../../../dtos/auth/token-response';
import {TokenService} from '../token.service';
import {GeneralCause} from '../../../core/errors/cause/general.cause';
import {GeneralException} from '../../../core/errors/exceptions';

@Injectable()
export class GoogleOauthService {

  constructor(private httpService: HttpService,
              private userService: UserService,
              private redisService: RedisService,
              private tokenService: TokenService) {}

  async registerOrLoginSocialUser(message: AuthCodeExchangeMessage): Promise<TokenResponse> {
    const externalTokens = await this.exchangeAuthCode(message);
    const userInfo = await this.getUserInfo(externalTokens.access_token);
    const result = await this.userService.registerOrLoginGoogleUser(this.mapUserInfoToRegistrationMessage(userInfo));
    const tokens = await this.tokenService.createTokens(result.userId, message.clientId);

    await this.redisService.addTokenAndSetExpiration(tokens.accessToken, {value: externalTokens.access_token}, 'access:google', Number(externalTokens.expires_in));
    await this.redisService.addTokenAndSetExpiration(tokens.refreshToken, {value: externalTokens.refresh_token}, 'refresh:google');

    return tokens;
  }

  private async exchangeAuthCode(message: AuthCodeExchangeMessage): Promise<GoogleTokenResponse> {
    try {
      return await this.httpService.post<GoogleTokenResponse>(
        `https://oauth2.googleapis.com/token?` +
        `client_id=${message.clientId}&` +
        `client_secret=${environment.security.oauth.google.clientSecret}&` +
        `redirect_uri=${message.redirectUri}&` +
        `code=${message.code}&grant_type=authorization_code`).toPromise().then(_ => _.data);
    } catch (e) {
      throw new GeneralException(GeneralCause.DEPENDANT_SERVICE_ERROR);
    }
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUserInfoResponse> {
    const response = await this.httpService.get<GoogleUserInfoResponse>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).toPromise();

    return response.data;
  }

  private mapUserInfoToRegistrationMessage(userInfo: GoogleUserInfoResponse): RegisterGoogleUserMessage {
    return {
      externalId: userInfo.id,
      email: userInfo.email,
      picture: userInfo.picture
    };
  }
}
