import {Document} from 'mongoose';

export class CreatedResponse {
  constructor(public id: string) {}

  static of(model: Document) {
    return new CreatedResponse(model._id);
  }
}
