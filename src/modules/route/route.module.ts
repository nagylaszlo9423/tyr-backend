import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RouteSchema} from "./route.schema";
import {RouteService} from "./route.service";

@Module({
  imports: [MongooseModule.forFeature([{name: 'Route', schema: RouteSchema}])],
  controllers: [],
  providers: [RouteService]
})
export class UserModule {
}
