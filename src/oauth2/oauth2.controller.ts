import {Body, Controller, Get, Param, Post, Query, Req, Res} from "@nestjs/common";
import {LoginRequest} from "../api/oauth2/login.request";
import {Response} from 'express';
import {AuthService} from "./auth.service";
import {environment} from "../environment/environment";
import {RegistrationRequest} from "../api/oauth2/registration.request";
import {BadRequest} from "../api/errors/errors";
import {TokenService} from "./token.service";

@Controller('oauth')
export class Oauth2Controller {

  constructor(private authService: AuthService,
              private tokenService: TokenService) {
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
        @Query('refresh_token') refreshToken: string) {
    if (grantType !== 'authorization_code' && grantType !== 'refresh_token' || !clientId) {
      throw new BadRequest()
    }
    if (grantType === 'authorization_code' && code) {
      this.tokenService.exchangeCode(code, clientId, redirectUri);
    }
    if (grantType === 'refresh_token' && refreshToken) {
      this.tokenService.refreshToken(refreshToken);
    }
    throw new BadRequest();
  }

  @Post('login')
  login(@Body() request: LoginRequest) {
    this.authService.login(request);
  }

  @Post('logout')
  logout() {

  }

  @Post('login/:provider(google|facebook)')
  loginSocial(@Param('provider') provider: string) {

  }

  @Post('register')
  register(@Body() request: RegistrationRequest) {

  }
}
