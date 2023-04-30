import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { ProductCreatedEvent } from '../impl/product-created.event';

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedEventHandler
  implements IEventHandler<ProductCreatedEvent>
{
  constructor(private productsRepository: ProductsRepository) {}

  async handle(event: ProductCreatedEvent) {
    const { product } = event;

    return await this.productsRepository.create(product, 'ProductCreatedEvent');

    // await this.productsRepository.logEvent(id, 'created');
  }
}
