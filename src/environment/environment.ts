import localEnv from './local.environment';


export class Environment {
  port: number;
  frontendUrl: string;
  loginPageUrl: string;
  frontend: {
    url: string;
    loginPage: string;
  };
  accessToken: {
    length: number;
    expiresInMinutes: number;
  };
  refreshToken: {
    length: number;
    expiresInMinutes: number;
  };
  authorizationCode: {
    length: number;
    expiresInMinutes: number;
  };

  constructor(init: Environment) {
    Object.assign(this, init);
  }
}

let _environment: Environment = localEnv;
export const environment = _environment;
