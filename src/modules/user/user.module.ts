import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './user.schema';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {GroupModule} from '../group/group.module';
import {ModelNames} from '../../db/model-names';

@Module({
  imports: [
    MongooseModule.forFeature([{name: ModelNames.User, schema: UserSchema}])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
