import { CommandHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { ProductCreatedEvent } from '../logic/product-created.event';

@CommandHandler(ProductCreatedEvent)
export class ProductCreatedEventHandler
  implements IEventHandler<ProductCreatedEvent>
{
  constructor(private productsRepository: ProductsRepository) {}

  async handle(event: ProductCreatedEvent) {
    console.log('ProductCreatedEvent', event);
  }
}
