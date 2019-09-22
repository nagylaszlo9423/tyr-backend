import {Body, Controller, Get, Param, Post, Query, Res} from "@nestjs/common";
import {LoginRequest} from "../api/oauth2/login.request";
import {Response} from 'express';
import {AuthService} from "./auth.service";
import {environment} from "../environment/environment";
import {RegistrationRequest} from "../api/oauth2/registration.request";
import {BadRequestException} from "../api/errors/errors";
import {TokenResponse} from "../api/oauth2/token.response";
import {LoginResponse} from "../api/oauth2/login.response";

@Controller('oauth')
export class Oauth2Controller {

  constructor(private authService: AuthService) {
  }

  @Get('authorize')
  authorize(@Query('response_type') responseType: string,
            @Query('client_id') clientId: string,
            @Query('redirect_uri') redirectUri: string,
            @Res() response: Response) {
    if (!responseType || !clientId) {
      response.append('error', 'invalid_request');
      response.redirect(environment.loginPageUrl);
    }
    response.append('client_id', clientId);
    response.append('redirect_uri', redirectUri);
    response.redirect(environment.loginPageUrl);
  }

  @Post('token')
  token(@Query('grant_type') grantType: string,
        @Query('code') code: string,
        @Query('redirect_uri') redirectUri: string,
        @Query('client_id') clientId: string,
        @Query('refresh_token') refreshToken: string): Promise<TokenResponse> {
    if (grantType !== 'authorization_code' && grantType !== 'refresh_token' || !clientId) {
      throw new BadRequestException()
    }
    if (grantType === 'authorization_code' && code) {
      return this.authService.exchangeAuthorizationCodeForTokens(code, clientId, redirectUri);
    }
    if (grantType === 'refresh_token' && refreshToken) {
     return this.authService.refreshTokens(refreshToken);
    }
    throw new BadRequestException();
  }

  @Post('login')
  login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @Post('logout')
  logout() {

  }

  @Post('login/:provider(google|facebook)')
  loginSocial(@Param('provider') provider: string) {

  }

  @Post('register')
  register(@Body() request: RegistrationRequest) {
    return this.authService.register(request);
  }
}
