import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RouteSchema} from "../route/route.schema";
import {RouteController} from "../route/route.controller";
import {RouteService} from "../route/route.service";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Group', schema: RouteSchema}])
  ],
  controllers: [RouteController],
  providers: [RouteService]
})
export class GroupModule {
}
