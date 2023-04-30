import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { ProductsRepository } from './products.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { FindAllProductsHandler } from './queries/handlers/find-all-products.handler';
import { FindByIdProductsHandler } from './queries/handlers/find-by-id-products.handler';
import { UpdateProductHandler } from './commands/handlers/update-product.handler';
import { RemoveProductHandler } from './commands/handlers/remove-product.handler';
import { ProductEventHandlers } from './events/handlers';
import { EventStoreService } from '../event-store.service';

export const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  RemoveProductHandler,
];
export const EventHandlers = ProductEventHandlers;

export const QueryHandlers = [FindAllProductsHandler, FindByIdProductsHandler];

@Module({
  imports: [CqrsModule],
  providers: [
    ProductsRepository,
    ProductsResolver,
    ProductsService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    EventStoreService,
  ],
})
export class ProductsModule {}
