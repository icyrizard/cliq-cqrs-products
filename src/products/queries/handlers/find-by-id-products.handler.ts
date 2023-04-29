import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { Product } from '../../entities/product.entity';
import { FindByIdProductQuery } from '../impl/find-by-id-product.query';

@QueryHandler(FindByIdProductQuery)
export class FindByIdProductsHandler
  implements IQueryHandler<FindByIdProductQuery>
{
  constructor(private productsRepository: ProductsRepository) {}

  async execute(query: FindByIdProductQuery): Promise<Product> {
    console.log('FindByIdProductQuery', query);
    const { id } = query;

    return this.productsRepository.findOne(id);
  }
}
