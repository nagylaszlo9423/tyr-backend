import {Cause} from "./errors";


export class ErrorResponse {
  constructor(public cause: Cause, message?: string) {
  }
}
