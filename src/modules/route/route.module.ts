import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RouteService} from "./route.service";
import {RouteSchema} from "./route.schema";
import {RouteController} from "./route.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Route', schema: RouteSchema}])
  ],
  controllers: [RouteController],
  providers: [RouteService]
})
export class UserModule {
}
