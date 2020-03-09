import {Inject, Injectable, Request, Scope} from '@nestjs/common';
import {REQUEST} from '@nestjs/core';

@Injectable({scope: Scope.REQUEST})
export class ContextService {
  constructor(@Inject(REQUEST) private readonly context: Request) {}

  get userId(): string {
    return this.context.headers['User-Id'];
  }
}
