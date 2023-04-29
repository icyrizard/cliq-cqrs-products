import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from './products.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/handlers/create-product.handler';

import { ProductCreatedEventHandler } from './events/handlers/product-created.event.handler';
import { ProductFactory } from './product.factory';
import { FindAllProductsHandler } from './queries/handlers/find-all-products.handler';
import { FindByIdProductsHandler } from './queries/handlers/find-by-id-products.handler';
import { UpdateProductHandler } from './commands/handlers/update-product.handler';
import { ProductUpdatedEventHandler } from './events/handlers/product-updated.event.handler';
import { ProductRemovedEventHandler } from './events/handlers/product-removed.event.handler';
import { RemoveProductHandler } from './commands/handlers/remove-product.handler';

export const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  RemoveProductHandler,
];
export const EventHandlers = [
  ProductCreatedEventHandler,
  ProductUpdatedEventHandler,
  ProductRemovedEventHandler,
];

export const QueryHandlers = [FindAllProductsHandler, FindByIdProductsHandler];

@Module({
  imports: [
    CqrsModule,
    // EventStoreModule.registerFeature({
    //   type: 'event-store',
    //   featureStreamName: '$svc-product',
    //   subscriptions: [
    //     {
    //       type: EventStoreSubscriptionType.Persistent,
    //       stream: '$svc-product',
    //       persistentSubscriptionName: 'product',
    //     },
    //   ],
    //   eventHandlers: {
    //     // ProductCreatedEvent: ProductCreatedEventHandler,
    //     // ...EventHandlers,
    //     ProductCreatedEvent: (data) => () => {
    //       console.log(data);
    //       new ProductCreatedEvent(data);
    //     },
    //   },
    // }),
  ],
  providers: [
    ProductFactory,
    ProductsResolver,
    ProductsService,
    PrismaService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    ProductsRepository,
  ],
})
export class ProductsModule {}
