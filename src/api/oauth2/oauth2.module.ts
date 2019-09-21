import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";


@Module({
  imports: [
    PassportModule.register({defaultStrategy: ''})
  ]
})
export class Oauth2Module {

}
