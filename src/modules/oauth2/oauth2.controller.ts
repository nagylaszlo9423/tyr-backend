import {Body, Controller, Get, Header, Headers, Param, Post, Query, Res} from "@nestjs/common";
import {Response} from 'express';
import {AuthService} from "./auth.service";
import {environment} from "../../environment/environment";
import {BadRequestException} from "../../errors/errors";
import {LoginRequest, LoginResponse, LogoutRequest, RegistrationRequest, TokenResponse} from "tyr-api";

@Controller('/oauth')
export class Oauth2Controller {

  constructor(private authService: AuthService) {
  }

  @Get('/authorize')
  authorize(@Query('response_type') responseType: string,
            @Query('client_id') clientId: string,
            @Query('redirect_uri') redirectUri: string,
            @Res() response: Response) {
    if (!responseType || !clientId) {
      response.append('error', 'invalid_request');
      response.redirect(environment.frontend.loginPage);
    }
    response.append('client_id', clientId);
    response.append('redirect_uri', redirectUri);
    response.redirect(environment.frontend.loginPage);
  }

  @Post('/token')
  token(@Query('grant_type') grantType: string,
        @Query('code') code?: string,
        @Query('redirect_uri') redirectUri?: string,
        @Query('client_id') clientId?: string,
        @Query('refresh_token') refreshToken?: string): Promise<TokenResponse> {
    if (grantType !== 'authorization_code' && grantType !== 'refresh_token' || !clientId) {
      throw new BadRequestException()
    }
    if (grantType === 'authorization_code' && code && redirectUri) {
      return this.authService.exchangeAuthorizationCodeForTokens(code, clientId, redirectUri);
    }
    if (grantType === 'refresh_token' && refreshToken) {
     return this.authService.refreshTokens(refreshToken);
    }
    throw new BadRequestException();
  }

  @Post('/login')
  login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(request);
  }

  @Post('/logout')
  logout(@Body() request: LogoutRequest) {
    if (!request.accessToken) throw new BadRequestException();
    return this.authService.logout(request.accessToken);
  }

  @Post('/logout/all')
  logoutEverywhere(@Body() request: LogoutRequest) {
    if (!request.accessToken) throw new BadRequestException();
    return this.authService.logoutEverywhere(request.accessToken);
  }

  @Post('/login/:provider(google|facebook)')
  loginSocial(@Param('provider') provider: string) {

  }

  @Post('register')
  register(@Body() request: RegistrationRequest) {
    return this.authService.register(request);
  }
}
