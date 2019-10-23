import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ResourceService} from "./resource.service";
import {ResourceItemSchema} from "./resource-item.schema";


@Module({
  imports: [
    MongooseModule.forFeature([{name: 'ResourceItem', schema: ResourceItemSchema}])
  ],
  providers: [ResourceService]
})
export class ResourceModule {
}

