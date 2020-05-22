
export class StatusCodeValidator {

  static is2xx(status: number): boolean {
    return status >= 200 && status < 300;
  }

  static is4xx(status: number): boolean {
    return status >= 400 && status < 500;
  }

  static is5xx(status: number): boolean {
    return status >= 500 && status < 600;
  }

}
