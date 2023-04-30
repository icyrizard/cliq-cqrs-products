import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
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

    console.log('ProductUpdatedEvent', this.eventStore.findMany());

    return data;
  }
}
