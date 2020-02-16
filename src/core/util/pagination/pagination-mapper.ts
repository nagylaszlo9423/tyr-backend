import {PageResponse} from "../../dto/page.response";
import {Page} from "./page";

export function mapResultsToPageResponse<T, R>(results: Page<T>, mapper: (items: T[]) => R[]): PageResponse<R> {
  const response = new PageResponse<R>();

  response.page = results.page;
  response.size = results.size;
  if (mapper) {
    response.items = mapper(results.items);
  } else {
    response.items = results.items as any[];
  }

  return response;
}
