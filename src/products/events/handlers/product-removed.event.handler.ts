import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductRemovedEvent } from '../impl/product-removed.event';
import { EventStoreService } from '../../../event-store.service';
import { EventsEnum } from '../../common/events.enum';

@EventsHandler(ProductRemovedEvent)
export class ProductRemovedEventHandler
  implements IEventHandler<ProductRemovedEvent>
{
  constructor(private eventStore: EventStoreService) {}

  async handle(event: ProductRemovedEvent) {
    const { id } = event;

    return await this.eventStore.remove(id, EventsEnum.ProductRemoved);
  }
}
