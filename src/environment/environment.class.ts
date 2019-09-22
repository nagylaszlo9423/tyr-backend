import {LogLevel} from "@nestjs/common";


export class Environment {
  port: number;
  frontendUrl: string;
  loginPageUrl: string;
  logLevel: LogLevel[];
  mongoDbUrl: string;
  collection: string;
  frontend: {
    url: string;
    loginPage: string;
  };
  accessToken: {
    length: number;
    expiresInMinutes: number;
    autoCleanInMillis: number;
  };
  refreshToken: {
    length: number;
    expiresInMinutes: number;
    autoCleanInMillis: number;
  };
  authorizationCode: {
    length: number;
    expiresInMinutes: number;
    autoCleanInMillis: number;
  };

  constructor(init: Environment) {
    Object.assign(this, init);
  }
}
