import {PageResponse} from '../../dto/page.response';
import {Page} from './page';

export function mapResultsToPageResponse<T, R>(results: Page<T>, mapper: (items: T) => R): PageResponse<R> {
  const response = new PageResponse<R>();

  response.page = results.page;
  response.size = results.size;
  response.total = results.total;
  if (mapper) {
    response.items = results.items.map(mapper);
  } else {
    response.items = [];
  }

  return response;
}
