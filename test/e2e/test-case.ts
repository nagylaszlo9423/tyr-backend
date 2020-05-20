import {INestApplication} from '@nestjs/common';
import {AuthenticationHelper} from './helper/authentication.helper';

export interface TestCase {
  name: string;
  authenticateUser?: boolean;
  test: (app: INestApplication, authHelper: AuthenticationHelper) => void;
}
