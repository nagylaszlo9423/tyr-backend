import {e2eSuite} from '../e2e-suite';
import {request} from '../helper/request';
import {asyncTest} from '../helper/async.test';

e2eSuite('OAuthController', [
  {
   name: 'should register user',
   test: async (app, authHelper) => {
     await asyncTest(request(app)
       .post('/oauth/register')
       .send(authHelper.createRegistrationRequest())
       .expect(201));
   }
  }
]);
