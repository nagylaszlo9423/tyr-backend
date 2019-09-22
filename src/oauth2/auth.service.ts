import {Injectable} from "@nestjs/common";
import {LoginRequest} from "../api/oauth2/login.request";
import {UserService} from "../user/user.service";
import {RegistrationRequest} from "../api/oauth2/registration.request";
import {RegistrationResponse} from "../api/oauth2/registration.response";
import {LoginResponse} from "../api/oauth2/login.response";
import {AuthorizationCodeService} from "./authorization-code.service";
import {TokenService} from "./token.service";
import {TokenResponse} from "../api/oauth2/token.response";


@Injectable()
export class AuthService {

  constructor(private userService: UserService,
              private authCodeService: AuthorizationCodeService,
              private tokenService: TokenService) {
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const userId = await this.userService.login(request);
    const code = await this.authCodeService.createAuthorizationCode(userId, request.clientId, request.redirectUri);
    return new LoginResponse({code: code, redirectUri: request.redirectUri});
  }

  async exchangeAuthorizationCodeForTokens(code: string, clientId: string, redirectUri: string): Promise<TokenResponse> {
    const userId = await this.authCodeService.getUserIdForAuthorizationCode(code, clientId, redirectUri);
    return this.tokenService.createTokens(userId, clientId);
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    return this.tokenService.renewToken(refreshToken);
  }

  async register(request: RegistrationRequest): Promise<RegistrationResponse> {
    return this.userService.register(request);
  }
}
