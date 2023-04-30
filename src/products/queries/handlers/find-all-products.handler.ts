import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllProductsQuery } from '../impl/find-all-products.query';
import { ProductsRepository } from '../../products.repository';

@QueryHandler(FindAllProductsQuery)
export class FindAllProductsHandler
  implements IQueryHandler<FindAllProductsQuery>
{
  constructor(private productsRepository: ProductsRepository) {}

  async execute(query: FindAllProductsQuery) {
    return this.productsRepository.findAll();
  }
}
