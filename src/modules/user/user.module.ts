import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './user.schema';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {ModelNames} from '../../db/model-names';
import {CoreModule} from '../../core/core.module';
import {ExternalUserInfoSchema} from './external-user-info.schema';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forFeature([
      {name: ModelNames.User, schema: UserSchema},
      {name: ModelNames.ExternalUserInfo, schema: ExternalUserInfoSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}
