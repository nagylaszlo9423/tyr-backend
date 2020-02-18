import {Injectable} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {AuthorizationCodeService} from "./authorization-code.service";
import {TokenService} from "./token.service";
import {LoginRequest, LoginResponse, RegistrationRequest, RegistrationResponse, TokenResponse} from "tyr-api";


@Injectable()
export class AuthService {

  constructor(private userService: UserService,
              private authCodeService: AuthorizationCodeService,
              private tokenService: TokenService) {
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const userId = await this.userService.login(request);
    const code = await this.authCodeService.createAuthorizationCode(userId, request.clientId, request.redirectUri);
    const response = new LoginResponse();
    response.code = code;
    response.redirectUri = request.redirectUri;
    return response;
  }

  async exchangeAuthorizationCodeForTokens(code: string, clientId: string, redirectUri: string): Promise<TokenResponse> {
    const userId = await this.authCodeService.getUserIdForAuthorizationCode(code, clientId, redirectUri);
    return this.tokenService.createTokens(userId, clientId);
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
