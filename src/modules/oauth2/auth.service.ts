import {Injectable} from '@nestjs/common';
import {UserService} from '../user/user.service';
import {AuthorizationCodeService} from './authorization-code.service';
import {TokenService} from './token.service';
import {LoginRequest} from '../../dtos/auth/login-request';
import {LoginResponse} from '../../dtos/auth/login-response';
import {TokenResponse} from '../../dtos/auth/token-response';
import {RegistrationResponse} from '../../dtos/auth/registration-response';
import {RegistrationRequest} from '../../dtos/auth/registration-request';
import {AuthCodeExchangeMessage} from './messages/auth-code-exchange.message';
import {environment} from '../../environment/environment';
import {GoogleOauthService} from './social/google-oauth.service';
import {UnauthorizedException} from '../../core/errors/exceptions';
import {FacebookOauthService} from './social/facebook-oauth.service';

@Injectable()
export class AuthService {

  constructor(private userService: UserService,
              private authCodeService: AuthorizationCodeService,
              private tokenService: TokenService,
              private googleOauthService: GoogleOauthService,
              private facebookOauthService: FacebookOauthService) {
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const userId = await this.userService.login(request);
    const code = await this.authCodeService.createAuthorizationCode(userId, request.clientId, request.redirectUri);
    const response = new LoginResponse();
    response.code = code;
    response.redirectUri = request.redirectUri;
    return response;
  }

  async exchangeAuthCodeForTokens(message: AuthCodeExchangeMessage): Promise<TokenResponse> {
    switch (message.clientId) {
      case environment.security.oauth.facebook.clientId:
        return this.facebookOauthService.registerOrLoginSocialUser(message);
      case environment.security.oauth.google.clientId:
        return this.googleOauthService.registerOrLoginSocialUser(message);
      case environment.security.oauth.self.clientId:
        const userId = await this.authCodeService.getUserIdForAuthorizationCode(message);
        return this.tokenService.createTokens(userId, message.clientId);
      default:
        throw new UnauthorizedException();
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    return this.tokenService.renewToken(refreshToken);
  }

  logout(accessToken: string): Promise<void> {
    return this.tokenService.removeAccessToken(accessToken);
  }

  logoutEverywhere(accessToken: string) {
    return this.tokenService.removeTokens(accessToken);
  }

  register(request: RegistrationRequest): Promise<RegistrationResponse> {
    return this.userService.register(request);
  }
}
