import {LogLevel} from "@nestjs/common";
import {defaultEnvironment} from "./default.environment";
import {merge} from 'lodash';

export class Environment {
  port?: number = 3001;
  logLevel?: LogLevel[] = ['debug', 'log', 'warn', 'error', 'verbose'];
  db?: {
    name?: string,
    url?: string,
    username: string,
    password: string
  };
  frontend?: {
    url?: string,
    loginPage?: string
  };
  security?: {
    accessToken?: {
      length?: number,
      expiresInMinutes?: number,
      autoCleanInMillis?: number
    },
    refreshToken?: {
      expiresInMinutes?: number,
      length?: number,
      autoCleanInMillis?: number
    },
    authorizationCode?: {
      expiresInMinutes?: number,
      length?: number,
      autoCleanInMillis?: number
    },
    encryption?: {
      cipherKey?: string,
      initVector?: string
    }
  };
  roles?: {
    admin?: [],
    user?: []
  };

  constructor(init?: Partial<Environment>) {
    init = init || {};
    Object.assign(this, merge(defaultEnvironment, init));
  }
}
