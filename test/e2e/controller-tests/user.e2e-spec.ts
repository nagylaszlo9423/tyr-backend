import * as request from 'supertest';
import {e2eSuite} from '../e2e-suite';
import {asyncTest} from '../helper/async.test';

e2eSuite('UserController', {
  authenticateNewUser: true
}, [
  {
    name: 'should get user profile',
    test: async (app, authHelper) => {
      await asyncTest(request(app.getHttpServer())
        .get('/user/profile/info')
        .set(authHelper.header)
        .expect(200));
    }
  }
]);
