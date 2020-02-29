import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RouteService} from "./route.service";
import {RouteSchema} from "./route.schema";
import {RouteController} from "./route.controller";
import {CoreModule} from "../../core/core.module";
import {GroupModule} from "../group/group.module";
import {LineStringSchema} from "../../core/schemas/line-string.schema";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
    CoreModule,
    GroupModule,
    UserModule,
    MongooseModule.forFeature([{name: 'Route', schema: RouteSchema}]),
    MongooseModule.forFeature([{name: 'LineString', schema: LineStringSchema}])
  ],
  controllers: [RouteController],
  providers: [RouteService]
})
export class RouteModule {
}
