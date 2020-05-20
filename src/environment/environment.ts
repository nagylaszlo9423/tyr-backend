import {LocalEnvironment} from './local.environment';
import {Environment} from './environment.class';
import {TestEnvironment} from './test.environment';

const env = process.env.NODE_ENV;

let _environment: Environment;

if (env === 'test') {
  _environment = TestEnvironment;
} else {
  _environment = LocalEnvironment;
}

export const environment = _environment;
