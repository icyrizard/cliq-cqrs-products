import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from './products.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/handlers/create-product.handler';

import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { ProductCreatedEvent } from './events/impl/product-created.event';

import { ProductCreatedEventHandler } from './events/handlers/product-created.event.handler';
import { ProductFactory } from './product.factory';

export const CommandHandlers = [CreateProductHandler];
export const EventHandlers = [ProductCreatedEventHandler];
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
    ProductsRepository,
  ],
})
export class ProductsModule {}
