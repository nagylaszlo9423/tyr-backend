import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AppModule} from '../../src/app.module';
import {TestCase} from './test-case';
import {AuthenticationHelper} from './helper/authentication.helper';
import {environment} from '../../src/environment/environment';
import {DbUtils} from '../../src/db/db-utils';

interface E2eSuiteOptions {
  authenticateNewUser?: boolean;
}

export function e2eSuite(name: string, options: E2eSuiteOptions, tests: TestCase[]) {
  let app: INestApplication;
  let authHelper: AuthenticationHelper;

  describe(name, () => {
    beforeAll((done) => {
      (async () => {
        await DbUtils.dropDb(environment.db.name);
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication(undefined, {
          logger: environment.logLevel
        });
        await app.init();
        authHelper = new AuthenticationHelper(app, name);
        if (options?.authenticateNewUser) {
          await authHelper.registerUser();
          await authHelper.login();
        }
      })().then(done);
    });

    tests.forEach(test => {
      it(test.name, (done) => {
        test.test(app, authHelper).then(done).catch(done);
      });
    });

    afterAll((done) => {
      (async () => {
        await app.close();
      })().then(done);
    });
  });
}
