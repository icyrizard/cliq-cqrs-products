import { IQuery } from '@nestjs/cqrs';

export class FindByIdProductQuery implements IQuery {
  constructor(public readonly id: string) {}
}
