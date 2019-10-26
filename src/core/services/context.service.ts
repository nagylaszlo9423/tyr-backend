import {Inject, Injectable, Request, Scope} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";

@Injectable({scope: Scope.REQUEST})
export class ContextService {
  private readonly _userId: string;

  constructor(@Inject(REQUEST) private readonly context: Request) {
    this._userId = context.headers.get('User-Id');
  }

  get userId(): string {
    return this._userId;
  }
}
