import { AggregateRoot } from '@nestjs/cqrs';

export class Model<T> extends AggregateRoot {
  public model: any;

  constructor(model: T | undefined) {
    super();

    this.model = model;
  }

  setModel<T>(model: T) {
    this.model = model;
  }
}
