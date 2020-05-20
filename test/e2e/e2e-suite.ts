import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../src/app.module';
import {TestCase} from './test-case';
import {dropCollections} from '../../src/db/drop-collections';
import {TestEnvironment} from '../../src/environment/test.environment';
import {AuthenticationHelper} from './helper/authentication.helper';

export function e2eSuite(name: string, tests: TestCase[]) {
  let app: INestApplication;
  let authHelper: AuthenticationHelper;

  describe(name, () => {
    beforeAll(async () => {
      await dropCollections(TestEnvironment.db.name);
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      authHelper = new AuthenticationHelper(app);
      await authHelper.registerUser();
    });

    tests.forEach(test => {
      it(test.name, async (done) => {
        try {
          if (test.authenticateUser) {
            await authHelper.login();
          }

          await test.test(app, authHelper);
          return done();
        } catch (e) {
          return done(e);
        }
      });
    });

    afterAll(async () => {
      await app.close();
    });
  });

}
