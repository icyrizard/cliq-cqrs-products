import { AggregateRoot } from '@nestjs/cqrs';

export class AggregateObject<T> extends AggregateRoot {
  private _data: T;

  constructor(data: T | undefined) {
    super();

    this._data = data;
  }

  get data(): any {
    return this._data;
  }

  set data(value: T) {
    this._data = value;
  }
}
