import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RouteService} from "./route.service";
import {RouteSchema} from "./route.schema";
import {RouteController} from "./route.controller";
import {CoreModule} from "../../core/core.module";
import {GroupModule} from "../group/group.module";

@Module({
  imports: [
    CoreModule,
    GroupModule,
    MongooseModule.forFeature([{name: 'Route', schema: RouteSchema}])
  ],
  controllers: [RouteController],
  providers: [RouteService]
})
export class RouteModule {
}
