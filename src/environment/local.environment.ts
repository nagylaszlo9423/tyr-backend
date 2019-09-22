import {Environment} from "./environment";


export default new Environment({
  port: 3001,
  frontendUrl: 'http://localhost:3000',
  loginPageUrl: 'http://localhost:3000/login',
  frontend: {
    url: 'http://localhost:3000',
    loginPage: 'http://localhost:3000/login',
  },
  accessToken: {
    expiresInMinutes: 5,
    length: 256
  },
  refreshToken: {
    expiresInMinutes: 10080,
    length: 256
  },
  authorizationCode: {
    expiresInMinutes: 5,
    length: 32
  }
});
