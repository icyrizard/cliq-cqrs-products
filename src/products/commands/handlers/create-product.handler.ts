import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { CreateProductCommand } from '../impl/create-product.command';
import { ProductsRepository } from '../../products.repository';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private productRepository: ProductsRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProductCommand) {
    const { data } = command;

    const product = this.publisher.mergeObjectContext(
      await this.productRepository.create(data),
    );

    product.commit();

    return product.getData();
  }
}
