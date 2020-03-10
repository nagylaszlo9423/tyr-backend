import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './user.schema';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {ModelNames} from '../../db/model-names';
import {CoreModule} from '../../core/core.module';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forFeature([{name: ModelNames.User, schema: UserSchema}])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
