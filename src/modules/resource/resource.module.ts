import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ResourceService} from './resource.service';
import {ResourceItemSchema} from './resource-item.schema';
import {ModelNames} from '../../db/model-names';

@Module({
  imports: [
    MongooseModule.forFeature([{name: ModelNames.ResourceItem, schema: ResourceItemSchema}])
  ],
  providers: [ResourceService]
})
export class ResourceModule {
}

