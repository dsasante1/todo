export abstract class BaseEntity<T> {
  constructor(props?: Partial<T>) {
    Object.assign(this, props ?? {});
  }
  public static get() {
    return this;
  }
}
