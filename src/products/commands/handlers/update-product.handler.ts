import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ProductsRepository } from '../../products.repository';
import { UpdateProductCommand } from '../impl/update-product.command';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    private readonly productRepository: ProductsRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: UpdateProductCommand) {
    const { data } = command;

    const { id } = data;

    const product = this.publisher.mergeObjectContext(
      await this.productRepository.update(id, data),
    );

    product.commit();

    return product.getData();
  }
}
