import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {GroupController} from "./group.controller";
import {GroupService} from "./group.service";
import {ContextService} from "../../core/services/context.service";
import {GroupSchema} from "./group.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Group', schema: GroupSchema}]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService,
    ContextService
  ],
  exports: [GroupService]
})
export class GroupModule {
}
