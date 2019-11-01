import {Environment} from "./environment.class";

function hoursToMillis(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export const LocalEnvironment = new Environment({
  port: 3001,
  frontendUrl: 'http://localhost:3000',
  loginPageUrl: 'http://localhost:3000/login',
  logLevel: ['debug', 'log', 'warn', 'error', 'verbose'],
  mongoDbUrl: 'mongodb://localhost',
  collection: 'tyr_dev_db',
  frontend: {
    url: 'http://localhost:3000',
    loginPage: 'http://localhost:3000/login',
  },
  accessToken: {
    expiresInMinutes: 500,
    length: 128,
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
  roles: {
    admin: [

    ],
    user: [

    ]
  },
});
