import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { CreateProductCommand } from '../impl/create-product.command';
import { ProductFactory } from '../../product.factory';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private productFactory: ProductFactory,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProductCommand) {
    const { data } = command;

    const product = this.publisher.mergeObjectContext(
      await this.productFactory.create(data),
    );

    product.commit();

    return product.data;
  }
}
