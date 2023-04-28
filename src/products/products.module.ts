import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from './products.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { ProductCreatedEventHandler } from './events/handlers/product-created.handler';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { ProductCreatedEvent } from './events/logic/product-created.event';

export const CommandHandlers = [CreateProductHandler];
export const EventHandlers = [ProductCreatedEventHandler];

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeature({
      type: 'event-store',
      featureStreamName: '$svc-product',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Persistent,
          stream: '$svc-product',
          persistentSubscriptionName: 'product',
        },
      ],
      eventHandlers: {
        ProductCreatedEvent: (data) => new ProductCreatedEvent(data),
      },
    }),
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    PrismaService,
    ...CommandHandlers,
    ...EventHandlers,
    ProductsRepository,
  ],
})
export class ProductsModule {}
