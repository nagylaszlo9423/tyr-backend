import * as mongoose from 'mongoose';
import {environment} from '../environment/environment';

export async function dropCollections(dbName: string) {
  await mongoose.connect(environment.getConnectionString(), {
    dbName: dbName,
    user: environment.db.username,
    pass: environment.db.password
  });
  await mongoose.connection.dropDatabase((err) => {
    // tslint:disable-next-line:no-console
    console.log(`${dbName} dropped`);
  });
  await mongoose.disconnect();
}
