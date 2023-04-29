import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateProductCommand } from '../impl/create-product.command';
import { ProductsRepository } from '../../products.repository';
import { ProductFactory } from '../../product.factory';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private productFactory: ProductFactory,
    private productRepository: ProductsRepository,
    private eventBus: EventBus,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProductCommand) {
    const { data } = command;

    // const createdProduct = new AggregateObject<Product>(
    //   await this.productRepository.create(data),
    // );

    const product = this.publisher.mergeObjectContext(
      await this.productFactory.create(data),
    );

    console.log('product', product);
    product.commit();

    return product.data;
  }
}
