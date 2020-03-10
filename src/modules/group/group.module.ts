import {Module, ParseIntPipe} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {GroupController} from './group.controller';
import {GroupService} from './group.service';
import {GroupSchema} from './group.schema';
import {JoinStatusSchema} from './join-request/join-status.schema';
import {JoinStatusService} from './join-request/join-status.service';
import {ModelNames} from '../../db/model-names';
import {UserModule} from '../user/user.module';
import {CoreModule} from '../../core/core.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ModelNames.Group, schema: GroupSchema},
      {name: ModelNames.JoinStatus, schema: JoinStatusSchema},
    ]),
    CoreModule,
    UserModule
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    ParseIntPipe,
    JoinStatusService,
  ],
  exports: [GroupService],
})
export class GroupModule {
}
