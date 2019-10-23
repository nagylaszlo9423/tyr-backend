import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ArticleSchema} from "./article.schema";
import {ArticleController} from "./article.controller";
import {ArticleService} from "./article.service";


@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Article', schema: ArticleSchema}])
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {
}
