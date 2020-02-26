
export interface IPaginationOptions {
  page: number;
  size: number;
}

export class PaginationOptions implements IPaginationOptions {
  page: number;
  size: number;

  private constructor(options: IPaginationOptions) {
    this.page = options.page;
    this.size = options.size;
  }

  skip(): number {
    return this.page * this.size;
  }

  static of(page: number, size: number): PaginationOptions {
    return new PaginationOptions({page: page, size: size});
  }
}
