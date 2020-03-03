import {Module} from "@nestjs/common";
import {ContextService} from "./services/context.service";
import {ArrayQueryPipe} from "./pipes/array-query.pipe";


@Module({
  providers: [
    ContextService,
    ArrayQueryPipe
  ],
  exports: [
    ContextService,
    ArrayQueryPipe
  ]
})
export class CoreModule {
}
