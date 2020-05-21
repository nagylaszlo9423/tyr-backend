import {LogLevel} from '@nestjs/common';
import {defaultEnvironment} from './default.environment';
import {merge} from 'lodash';

export function getConnectionString(): string {
  return `mongodb://${this.db.host}:${this.db.port}`;
}

export class Environment {
  env: string;
  port?: number = 3001;
  logLevel?: LogLevel[] | boolean = ['debug', 'log', 'warn', 'error', 'verbose'];
  db?: {
    name?: string,
    host?: string,
    port?: number,
    username?: string,
    password?: string
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

  getConnectionString(): string {
    return getConnectionString.bind(this)();
  }

  constructor(init?: Partial<Environment>) {
    if (init !== this) {
      init = init || {};
      Object.assign(this, merge(defaultEnvironment, init));
    }
  }
}
