import {environment} from '../environment/environment';
import {mongooseOptions} from '../mongoose-options';
import * as mongoose from 'mongoose';

mongoose.connect(environment.getConnectionString(), mongooseOptions).then();
