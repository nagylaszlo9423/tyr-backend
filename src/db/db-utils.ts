import * as mongoose from 'mongoose';
import {environment} from '../environment/environment';

export const DbUtils = {
  dropDb: async (dbName: string) => {
    await mongoose.connect(environment.getConnectionString(), {
      dbName: dbName,
      user: environment.db.username,
      pass: environment.db.password,
      useNewUrlParser: true
    });
    await mongoose.connection.db.dropDatabase((err) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log(`Failed to drop ${dbName}: ${err}`);
      } else {
        // tslint:disable-next-line:no-console
        console.log(`${dbName} dropped`);
      }
    });
    await mongoose.disconnect();
  }
};
