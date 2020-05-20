import {ObjectInitializer} from '../core/util/object-initializer';

export class PageResponse<T> extends ObjectInitializer<PageResponse<T>> {
  page: number;
  size: number;
  total: number;
  items: T[];
}
