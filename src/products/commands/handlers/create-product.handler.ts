import { CommandHandler, EventBus, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../logic/create-product.command';
import { ProductsRepository } from '../../products.repository';
import { ProductCreatedEvent } from '../../events/logic/product-created.event';
import { Product } from '../../entities/product.entity';
import { Model } from '../../entities/Model';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private productRepository: ProductsRepository,
    private eventBus: EventBus,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateProductCommand, resolve: (value?) => void) {
    const { data } = command;
    const createdProduct = new Model(await this.productRepository.create(data));

    const product: Model<Product> =
      this.publisher.mergeObjectContext(createdProduct);

    console.log({ createdProduct });

    // const event = this.eventBus.publish(
    //   new ProductCreatedEvent(createdProduct),
    // );
    product.commit();
    resolve();
  }
}
