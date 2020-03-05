import {ObjectInitializer} from "../util/object-initializer";

export class DeletionResult extends ObjectInitializer<DeletionResult> {
  ok: boolean;
  count: number;
}
