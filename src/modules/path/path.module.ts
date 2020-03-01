import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {CoreModule} from "../../core/core.module";
import {GroupModule} from "../group/group.module";
import {LineStringSchema} from "../../core/schemas/line-string.schema";
import {UserModule} from "../user/user.module";
import {PathSchema} from "./path.schema";
import {PathController} from "./path.controller";
import {PathService} from "./path.service";

@Module({
  imports: [
    CoreModule,
    GroupModule,
    UserModule,
    MongooseModule.forFeature([{name: 'Path', schema: PathSchema}]),
    MongooseModule.forFeature([{name: 'LineString', schema: LineStringSchema}])
  ],
  controllers: [PathController],
  providers: [PathService]
})
export class PathModule {
}
