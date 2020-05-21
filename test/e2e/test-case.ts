import {INestApplication} from '@nestjs/common';
import {AuthenticationHelper} from './helper/authentication.helper';

export interface TestCase {
  name: string;
  test: (app: INestApplication, authHelper: AuthenticationHelper) => Promise<void>;
}
