import {e2eSuite} from '../e2e-suite';
import * as request from 'supertest';
import {asyncTest} from '../helper/async.test';
import {Builder} from 'builder-pattern';
import {LoginRequest} from '../../../src/dtos/auth/login-request';
import {LoginResponse} from '../../../src/dtos/auth/login-response';
import {TokenResponse} from '../../../src/dtos/auth/token-response';
import {LogoutRequest} from '../../../src/dtos/auth/logout-request';

e2eSuite('OAuthController', {}, [
  {
   name: 'should register user',
   test: async (app, authHelper) => {
     await asyncTest(request(app.getHttpServer())
       .post('/oauth/register')
       .send(authHelper.createRegistrationRequest())
       .expect(201));
   }
  },
  {
    name: 'should login user',
    test: async (app, authHelper) => {
      const registrationRequest = authHelper.createRegistrationRequest();
      await authHelper.registerUser(registrationRequest);

      const loginRequest = Builder<LoginRequest>()
        .email(registrationRequest.email)
        .password(registrationRequest.password)
        .redirectUri('http://localhost/login')
        .clientId('client_id')
        .build();

      const loginResponse = await asyncTest<LoginResponse>(request(app.getHttpServer())
        .post('/oauth/login')
        .send(loginRequest)
        .expect(201));

      await asyncTest<TokenResponse>(request(app.getHttpServer())
        .post('/oauth/token')
        .query({
          grant_type: 'authorization_code',
          code: loginResponse.code,
          redirect_uri: loginResponse.redirectUri,
          client_id: 'client_id'
        })
        .send()
        .expect(201));
    }
  },
  {
    name: 'should logout user',
    test: async (app, authHelper) => {
      await authHelper.registerUser();
      const tokens = await authHelper.login();

      const body = Builder<LogoutRequest>()
        .accessToken(tokens.accessToken)
        .build();

      await asyncTest(request(app.getHttpServer())
        .post('/oauth/logout')
        .send(body)
        .expect(201));
    }
  },
  {
    name: 'should refresh tokens',
    test: async (app, authHelper) => {
      await authHelper.registerUser();
      const tokens = await authHelper.login();

      await asyncTest(request(app.getHttpServer())
        .post('/oauth/token')
        .query({
          grant_type: 'refresh_token',
          refresh_token: tokens.refreshToken,
          client_id: 'client_id'
        })
        .expect(201));
    }
  }
]);
