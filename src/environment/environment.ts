import {LocalEnvironment} from './local.environment';
import {Environment} from './environment.class';

const _environment: Environment = LocalEnvironment;
export const environment = _environment;
