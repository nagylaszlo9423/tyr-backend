import {Environment} from './environment.class';

export const TestEnvironment = new Environment({
  db: {
    name: 'test-db'
  },
  security: {
    encryption: {
      cipherKey: 'ea11509230502c6fe6f9576a46989f94',
      initVector: '79cb9d557a34758a0c00b20d091d64ca'
    }
  }
});
