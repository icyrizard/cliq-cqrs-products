import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductRemovedEvent } from '../impl/product-removed.event';
import { EventStoreService } from '../../../eventStore.service';

@EventsHandler(ProductRemovedEvent)
export class ProductRemovedEventHandler
  implements IEventHandler<ProductRemovedEvent>
{
  constructor(private eventStore: EventStoreService) {}

  async handle(event: ProductRemovedEvent) {
    const { id } = event;

    return await this.eventStore.remove(id, 'ProductRemovedEvent');
  }
}
