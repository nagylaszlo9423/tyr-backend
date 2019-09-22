import {LocalEnvironment} from './local.environment';
import {Environment} from "./environment.class";


let _environment: Environment = LocalEnvironment;
export const environment = _environment;
