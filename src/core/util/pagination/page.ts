import {PageResponse} from "../../dto/page.response";
import {ObjectInitializer} from "../object-initializer";


export class Page<T> extends ObjectInitializer<Page<T>> {
  page: number;
  size: number;
  total: number;
  items: T[];

  toResponse(): PageResponse<T> {
    return new PageResponse<T>({
      page: this.page,
      size: this.size,
      total: this.total,
      items: this.items
    });
  }
}
