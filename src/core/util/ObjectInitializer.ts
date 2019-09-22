

export abstract class ObjectInitializer<T> {
  public constructor(init?: Partial<T>) {
    init = init || {};
    Object.assign(this, init);
  }
}
