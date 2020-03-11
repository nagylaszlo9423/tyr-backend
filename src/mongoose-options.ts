import {MongooseModuleOptions} from '@nestjs/mongoose';
import {environment} from './environment/environment';

export const mongooseOptions: MongooseModuleOptions = {
  user: environment.db.username,
  pass: environment.db.password,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: environment.db.name
};
