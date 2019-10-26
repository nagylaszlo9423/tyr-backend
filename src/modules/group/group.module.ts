import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RouteSchema} from "../route/route.schema";
import {GroupController} from "./group.controller";
import {GroupService} from "./group.service";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Group', schema: RouteSchema}]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService]
})
export class GroupModule {
}
