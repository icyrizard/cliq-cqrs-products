import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductUpdatedEvent } from '../impl/product-updated.event';
import { EventStoreService } from '../../../event-store.service';
import { EventsEnum } from '../../common/events.enum';

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedEventHandler
  implements IEventHandler<ProductUpdatedEvent>
{
  constructor(private eventStore: EventStoreService) {}

  async handle(event: ProductUpdatedEvent) {
    const { data } = event;

    const { id } = data;

    await this.eventStore.update(id, EventsEnum.ProductUpdated, data);

    return data;
  }
}
