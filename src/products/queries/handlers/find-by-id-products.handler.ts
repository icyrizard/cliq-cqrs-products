import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { FindByIdProductQuery } from '../impl/find-by-id-product.query';
import { EventStoreData } from '../../../event-store.service';

@QueryHandler(FindByIdProductQuery)
export class FindByIdProductsHandler
  implements IQueryHandler<FindByIdProductQuery>
{
  constructor(private productsRepository: ProductsRepository) {}

  async execute(query: FindByIdProductQuery): Promise<EventStoreData> {
    const { id } = query;

    return this.productsRepository.findOne(id);
  }
}
