import {Module} from "@nestjs/common";
import {ContextService} from "./services/context.service";


@Module({
  providers: [
    ContextService
  ],
  exports: [
    ContextService
  ]
})
export class CoreModule {
}
