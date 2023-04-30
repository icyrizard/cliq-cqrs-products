import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../impl/product-created.event';
import { EventStoreService } from '../../../event-store.service';

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedEventHandler
  implements IEventHandler<ProductCreatedEvent>
{
  constructor(private eventStore: EventStoreService) {}

  async handle(event: ProductCreatedEvent) {
    const { data } = event;

    return await this.eventStore.create('product', 'ProductCreatedEvent', data);
  }
}
