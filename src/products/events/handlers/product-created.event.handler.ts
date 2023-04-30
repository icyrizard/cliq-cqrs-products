import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../impl/product-created.event';
import { ProductsEventStore } from '../../products.event-store';

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedEventHandler
  implements IEventHandler<ProductCreatedEvent>
{
  constructor(private productsEventStore: ProductsEventStore) {}

  async handle(event: ProductCreatedEvent) {
    const { data } = event;

    return await this.productsEventStore.create('ProductCreatedEvent', data);

    // await this.productsRepository.logEvent(id, 'created');
  }
}
