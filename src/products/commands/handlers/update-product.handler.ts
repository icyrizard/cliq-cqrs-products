import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';

import { ProductFactory } from '../../product.factory';
import { ProductsRepository } from '../../products.repository';
import { UpdateProductCommand } from '../impl/update-product.command';
import { ProductUpdatedEvent } from '../../events/impl/product-updated.event';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    private readonly productRepository: ProductsRepository,
    private productFactory: ProductFactory,
    private publisher: EventPublisher,
    private eventBus: EventBus,
  ) {}

  async execute(command: UpdateProductCommand) {
    const { data } = command;

    const { id } = data;

    const product = await this.productRepository.update(id, data);

    this.eventBus.publish(new ProductUpdatedEvent(id));

    return product;
  }
}
