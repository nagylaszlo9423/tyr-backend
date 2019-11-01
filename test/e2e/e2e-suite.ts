import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../../src/app.module";


export function e2eSuite(name: string, tests: {name: string, test: (app: INestApplication) => void}[]) {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    console.log('initialized');
  });

  tests.forEach(test => it(test.name, () => test.test(app)));

  afterAll(async () => {
    await app.close();
  });
}
