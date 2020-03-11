import {Environment, getConnectionString} from './environment.class';

function hoursToMillis(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export const defaultEnvironment: Environment = {
  port: 3001,
  logLevel: ['debug', 'log', 'warn', 'error', 'verbose'],
  db: {
    name: 'tyr_dev_db',
    host: 'localhost',
    port: 27017,
    username: 'tyr-admin',
    password: 'Asdqwe123'
  },
  frontend: {
    url: 'http://localhost:3000',
    loginPage: 'http://localhost:3000/login'
  },
  security: {
    accessToken: {
      length: 128,
      expiresInMinutes: 500,
      autoCleanInMillis: hoursToMillis(1)
    },
    refreshToken: {
      expiresInMinutes: 10080,
      length: 128,
      autoCleanInMillis: hoursToMillis(8)
    },
    authorizationCode: {
      expiresInMinutes: 5,
      length: 32,
      autoCleanInMillis: hoursToMillis(1)
    },
    encryption: {
      cipherKey: undefined,
      initVector: undefined
    }
  },
  roles: {
    admin: [],
    user: []
  },
  getConnectionString(): string {
    return getConnectionString.bind(this)();
  }
};
