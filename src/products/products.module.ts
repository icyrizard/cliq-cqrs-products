import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from './products.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { ProductCreatedEventHandler } from './events/handlers/product-created.handler';
import { EventSourcingModule } from 'event-sourcing-nestjs';

export const CommandHandlers = [CreateProductHandler];
export const EventHandlers = [ProductCreatedEventHandler];

@Module({
  imports: [CqrsModule, EventSourcingModule.forFeature()],
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
