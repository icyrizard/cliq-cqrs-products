import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { ProductRemovedEvent } from '../../events/impl/product-removed.event';
import { RemoveProductCommand } from '../impl/remove-product.command';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler
  implements ICommandHandler<RemoveProductCommand>
{
  constructor(
    private readonly productRepository: ProductsRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: RemoveProductCommand) {
    const { id } = command;

    const product = await this.productRepository.remove(id);

    this.eventBus.publish(new ProductRemovedEvent(id));

    return product;
  }
}
