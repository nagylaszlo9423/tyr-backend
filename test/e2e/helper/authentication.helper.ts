import {INestApplication} from '@nestjs/common';
import {RegistrationRequest} from '../../../src/dtos/auth/registration-request';
import {Builder} from 'builder-pattern';
import * as request from 'supertest';
import {RegistrationResponse} from '../../../src/dtos/auth/registration-response';
import {LoginRequest} from '../../../src/dtos/auth/login-request';
import {LoginResponse} from '../../../src/dtos/auth/login-response';
import {TokenResponse} from '../../../src/dtos/auth/token-response';
import {asyncTest} from './async.test';

class TestUser {
  userId: string;
  email: string;
  password: string;
  authCode: string;
  tokens?: TokenResponse;
}

export class AuthenticationHelper {
  private static userIndex = 0;
  private testUser: TestUser;

  constructor(private app: INestApplication, private testSuiteName: string) {
    this.testUser = new TestUser();
  }

  public async registerUser(body?: RegistrationRequest): Promise<void> {
    const body_ = body ? body : this.createRegistrationRequest();
    const response = await asyncTest<RegistrationResponse>(request(this.app.getHttpServer())
      .post('/oauth/register')
      .send(body_)
      .expect(201));
    this.testUser.userId = response.userId;
  }

  public async login(): Promise<TokenResponse> {
    const response = await asyncTest<LoginResponse>(request(this.app.getHttpServer())
      .post('/oauth/login')
      .send(this.loginRequest)
      .expect(201));
    this.testUser.authCode = response.code;

    return this.testUser.tokens = await asyncTest<TokenResponse>(request(this.app.getHttpServer())
      .post('/oauth/token')
      .query(this.tokenQuery)
      .expect(201));
  }

  public get header() {
    return {
      Authorization: this.testUser.tokens ? this.testUser.tokens.accessToken : ''
    };
  }

  public createRegistrationRequest(): RegistrationRequest {
    AuthenticationHelper.userIndex++;
    this.testUser.email = `test-mail-${this.testSuiteName}-${AuthenticationHelper.userIndex}@nestjstest.com`;
    this.testUser.password = `test-pass-${this.testSuiteName}-${AuthenticationHelper.userIndex}`;

    return Builder<RegistrationRequest>()
      .email(this.testUser.email)
      .password(this.testUser.password)
      .build();
  }

  private get loginRequest(): LoginRequest {
    return Builder<LoginRequest>()
      .email(this.testUser.email)
      .password(this.testUser.password)
      .clientId('client_id')
      .redirectUri('http://localhost/login')
      .build();
  }

  private get tokenQuery() {
    return {
      grant_type: 'authorization_code',
      code: this.testUser.authCode,
      redirect_uri: 'http://localhost/login',
      client_id: 'client_id'
    };
  }
}
