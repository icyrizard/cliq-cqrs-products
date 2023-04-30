import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductUpdatedEvent } from '../impl/product-updated.event';
import { EventStoreService } from '../../../eventStore.service';

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedEventHandler
  implements IEventHandler<ProductUpdatedEvent>
{
  constructor(private eventStore: EventStoreService) {}

  async handle(event: ProductUpdatedEvent) {
    const { data } = event;

    const { id } = data;

    await this.eventStore.update(id, 'ProductUpdatedEvent', data);

    return data;
  }
}
