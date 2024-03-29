import {Module, ParseIntPipe} from '@nestjs/common';
import {ModelDefinition, MongooseModule} from '@nestjs/mongoose';
import {CoreModule} from '../../core/core.module';
import {GroupModule} from '../group/group.module';
import {LineStringSchema} from '../../core/schemas/line-string.schema';
import {UserModule} from '../user/user.module';
import {PathSchema} from './path.schema';
import {PathController} from './path.controller';
import {PathService} from './path.service';
import {ModelNames} from '../../db/model-names';

const models: ModelDefinition[] = [
  {name: ModelNames.Path, schema: PathSchema},
  {name: ModelNames.LineString, schema: LineStringSchema}
];

@Module({
  imports: [
    CoreModule,
    GroupModule,
    UserModule,
    MongooseModule.forFeature(models)
  ],
  controllers: [PathController],
  providers: [
    PathService,
    ParseIntPipe
  ]
})
export class PathModule {
}
