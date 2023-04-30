import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { ProductRemovedEvent } from '../../events/impl/product-removed.event';
import { RemoveProductCommand } from '../impl/remove-product.command';
import { EventStoreService } from '../../../eventStore.service';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler
  implements ICommandHandler<RemoveProductCommand>
{
  constructor(
    private productRepository: ProductsRepository,
    private publisher: EventPublisher,
    private eventStore: EventStoreService,
  ) {}

  async execute(command: RemoveProductCommand) {
    const { id } = command;

    const productToDelete = await this.eventStore.findByIdOrThrow(id);

    const product = this.publisher.mergeObjectContext(
      await this.productRepository.remove(id),
    );

    product.commit();

    return productToDelete;
  }
}
