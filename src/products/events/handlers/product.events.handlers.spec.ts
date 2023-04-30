import { Test, TestingModule } from '@nestjs/testing';
import { ProductEventHandlers } from './index';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../impl/product-created.event';
import { ProductCreatedEventHandler } from './product-created.event.handler';
import { ProductsRepository } from '../../products.repository';
import { PrismaService } from '../../../prisma.service';

import { EventStoreService } from '../../../eventStore.service';
import { CreateProductInputWithId } from '../../dto/create-product.input';
import { ProductUpdatedEventHandler } from './product-updated.event.handler';
import { ProductUpdatedEvent } from '../impl/product-updated.event';
import { ProductRemovedEvent } from '../impl/product-removed.event';
import { ProductRemovedEventHandler } from './product-removed.event.handler';

describe('ProductEventHandlers', function () {
  let productCreatedEventHandler: ProductCreatedEventHandler;
  let productUpdatedEventHandler: ProductUpdatedEventHandler;
  let productRemovedEventHandler: ProductRemovedEventHandler;
  let eventBus: EventBus;
  let eventStore: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...ProductEventHandlers,
        PrismaService,
        ProductsRepository,
        EventBus,
        CommandBus,
        EventStoreService,
      ],
    }).compile();

    eventBus = module.get<EventBus>(EventBus);

    productCreatedEventHandler = module.get<ProductCreatedEventHandler>(
      ProductCreatedEventHandler,
    );

    productUpdatedEventHandler = module.get<ProductUpdatedEventHandler>(
      ProductUpdatedEventHandler,
    );

    productRemovedEventHandler = module.get<ProductRemovedEventHandler>(
      ProductRemovedEventHandler,
    );

    eventStore = module.get<EventStoreService>(EventStoreService);
  });

  describe('ProductCreatedEventHandler', () => {
    it('It should add the event to the eventStore', async () => {
      const newProduct: CreateProductInputWithId = {
        id: Math.random().toString(),
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      };

      const spy = jest.spyOn(productCreatedEventHandler, 'handle');
      const eventStorySpy = jest
        .spyOn(eventStore, 'create')
        .mockImplementation();

      eventBus.register([ProductCreatedEventHandler]);

      const event = new ProductCreatedEvent(newProduct);

      await eventBus.publish(event);

      expect(spy).toBeCalledWith(event);

      expect(eventStorySpy).toBeCalledWith(
        'product',
        'ProductCreatedEvent',
        newProduct,
      );
    });
  });

  describe('ProductUpdatedEventHandler', () => {
    it('It should update the event in the eventStore', async () => {
      const productUpdated: CreateProductInputWithId = {
        id: Math.random().toString(),
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      };

      const spy = jest.spyOn(productUpdatedEventHandler, 'handle');

      const eventStorySpy = jest
        .spyOn(eventStore, 'update')
        .mockImplementation();

      eventBus.register([ProductUpdatedEventHandler]);

      const event = new ProductUpdatedEvent(productUpdated);

      await eventBus.publish(event);

      expect(spy).toBeCalledWith(event);

      expect(eventStorySpy).toBeCalledWith(
        productUpdated.id,
        'ProductUpdatedEvent',
        productUpdated,
      );
    });
  });

  describe('ProductRemovedEventHandler', () => {
    it('It should call remove in the eventStore', async () => {
      const productDeleted: CreateProductInputWithId = {
        id: Math.random().toString(),
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      };

      const spy = jest.spyOn(productRemovedEventHandler, 'handle');

      const eventStorySpy = jest
        .spyOn(eventStore, 'remove')
        .mockImplementation();

      eventBus.register([ProductRemovedEventHandler]);

      const event = new ProductRemovedEvent(productDeleted.id);

      await eventBus.publish(event);

      expect(spy).toBeCalledWith(event);

      expect(eventStorySpy).toBeCalledWith(
        productDeleted.id,
        'ProductRemovedEvent',
      );
    });
  });
});
