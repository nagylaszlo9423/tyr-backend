import {PageResponse} from "tyr-api";
import {ObjectInitializer} from "./object-initializer";

interface IPaginationOptions {
  page: number;
  size: number;
}

export class PaginationOptions extends ObjectInitializer<PaginationOptions> implements IPaginationOptions {
  page: number;
  size: number;

  skip(): number {
    return this.page * this.size;
  }

  static of(page: number, size: number): PaginationOptions {
    return new PaginationOptions({page: page, size: size});
  }
}

export function mapResultsToPageResponse(results: any[], options: IPaginationOptions): PageResponse {
  const response = new PageResponse();

  response.page = options.page;
  response.size = options.size;
  response.items = results;

  return response;
}
