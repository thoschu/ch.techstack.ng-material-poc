export interface IAdmin<T> {
  id: T;
  name: string;
}

export class Admin<T> implements IAdmin<T> {
  private _id: T;
  private _name: string;

  constructor(id: T, name: string) {
    this._id = id;
    this._name = name;
  }

  public get id(): T {
    return this._id;
  }
  protected set id(id: T) {
    this._id = id;
  }

  public get name(): string {
    return this._name;
  }
  protected set name(name: string) {
    this._name = name;
  }
}
