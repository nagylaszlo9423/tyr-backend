import {Module, ParseIntPipe} from '@nestjs/common';
import {ContextService} from './services/context.service';
import {ArrayQueryPipe} from './pipes/array-query.pipe';
import {ParseIntArrayPipe} from './pipes/parse-int-array.pipe';

@Module({
  providers: [
    ContextService,
    ArrayQueryPipe,
    ParseIntArrayPipe,
    ParseIntPipe
  ],
  exports: [
    ContextService,
    ArrayQueryPipe
  ]
})
export class CoreModule {
}
