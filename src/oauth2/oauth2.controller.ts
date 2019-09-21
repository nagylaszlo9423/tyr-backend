import {Controller, Get, Param, Post, Req} from "@nestjs/common";
import {AuthService} from "./oauth2.service";
import {LoginRequest} from "../api/oauth2/login.request";
import {Request} from 'express';


@Controller('oauth')
export class Oauth2Controller {

  constructor(private authService: AuthService) {
  }

  @Get('authorize')
  authorize() {

  }

  @Post('token')
  token() {

  }

  @Post('login')
  login(@Req() request: Request) {
    this.authService.login(request.body as LoginRequest);
  }

  @Post('logout')
  logout() {

  }

  @Post('login/:provider(google|facebook)')
  loginSocial(@Param('provider') provider: string) {

  }
}
