import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { ProductRemovedEvent } from '../impl/product-removed.event';

@EventsHandler(ProductRemovedEvent)
export class ProductRemovedEventHandler
  implements IEventHandler<ProductRemovedEvent>
{
  constructor(private productsRepository: ProductsRepository) {}

  async handle(event: ProductRemovedEvent) {
    const { id } = event;

    // await this.productsRepository.logEvent(id, 'removed');
  }
}
