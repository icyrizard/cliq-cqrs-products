import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { ProductCreatedEvent } from '../impl/product-created.event';
import { ProductUpdatedEvent } from '../impl/product-updated.event';

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedEventHandler
  implements IEventHandler<ProductUpdatedEvent>
{
  constructor(private productsRepository: ProductsRepository) {}

  async handle(event: ProductCreatedEvent) {
    const { id } = event;

    await this.productsRepository.logEvent(id, 'updated');
  }
}
