import {Environment, getConnectionString} from './environment.class';

function hoursToMillis(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export const defaultEnvironment: Environment = {
  env: 'default',
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
    url: 'http://127.0.0.1:3000',
    loginPage: 'http://127.0.0.1:3000/login'
  },
  security: {
    oauth: {
      self: {
        clientId: 'tyr-app-client'
      },
      google: {
        clientId: '126368579163-6iom3cb435gq9p0snnvap8k38don9gn1.apps.googleusercontent.com',
        clientSecret: 'lKugpnk_U7COwuB4kNATEZ84'
      },
      facebook: {
        clientId: '2157192967885035',
        clientSecret: '13c5adcb735c792d46b6543e1cb3a266'
      }
    },
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
