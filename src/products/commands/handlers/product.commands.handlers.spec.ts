import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus, EventPublisher } from '@nestjs/cqrs';

import { ProductsRepository } from '../../products.repository';
import { PrismaService } from '../../../prisma.service';

import { CreateProductCommand } from '../impl/create-product.command';
import { CreateProductHandler } from './create-product.handler';
import { ProductFactory } from '../../product.factory';
import { ProductCreatedEventHandler } from '../../events/handlers/product-created.event.handler';
import { ProductCommandHandlers } from './index';
import { UpdateProductHandler } from './update-product.handler';
import { RemoveProductHandler } from './remove-product.handler';
import { EventStoreData, EventStoreService } from '../../../eventStore.service';
import { ProductsEventStore } from '../../products.event-store';
import { ProductUpdatedEventHandler } from '../../events/handlers/product-updated.event.handler';
import { UpdateProductCommand } from '../impl/update-product.command';
import { ProductRemovedEventHandler } from '../../events/handlers/product-removed.event.handler';
import { RemoveProductCommand } from '../impl/remove-product.command';
import { Product } from '../../entities/product.entity';

import { CreateProductInputWithId } from '../../dto/create-product.input';
import { UpdateProductInput } from '../../dto/update-product.input';
import { ProductEventHandlers } from '../../events/handlers';

describe('ProductCommands', function () {
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let createProductCommandHandler: CreateProductHandler;
  let updateProductCommandHandler: UpdateProductHandler;
  let removeProductCommandHandler: RemoveProductHandler;

  let productCreatedEventHandler: ProductCreatedEventHandler;
  let productUpdatedEventHandler: ProductUpdatedEventHandler;
  let productRemovedEventHandler: ProductRemovedEventHandler;
  let eventStore: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...ProductEventHandlers,
        ...ProductCommandHandlers,
        PrismaService,
        ProductsRepository,
        EventBus,
        CommandBus,
        ProductFactory,
        EventPublisher,
        EventStoreService,
        ProductsEventStore,
        EventStoreService,
      ],
    }).compile();

    commandBus = module.get<CommandBus>(CommandBus);
    eventBus = module.get<EventBus>(EventBus);

    createProductCommandHandler =
      module.get<CreateProductHandler>(CreateProductHandler);

    updateProductCommandHandler =
      module.get<UpdateProductHandler>(UpdateProductHandler);

    removeProductCommandHandler =
      module.get<RemoveProductHandler>(RemoveProductHandler);

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

    jest.spyOn(productCreatedEventHandler, 'handle').mockImplementation();
    jest.spyOn(productUpdatedEventHandler, 'handle').mockImplementation();
  });

  describe('ProductCreatedCommandHandler', () => {
    it('It should create a product and trigger an event', async () => {
      const newProduct: CreateProductInputWithId = {
        id: Math.random().toString(),
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      };

      const spy = jest.spyOn(createProductCommandHandler, 'execute');

      commandBus.register([CreateProductHandler]);
      eventBus.register([ProductCreatedEventHandler]);

      const command = new CreateProductCommand(newProduct);
      await commandBus.execute(command);

      expect(spy).toBeCalledWith(command);
    });
  });

  describe('ProductUpdateCommandHandler', () => {
    it('It should update a product and trigger an event', async () => {
      const updatedProduct: UpdateProductInput = {
        id: Math.random().toString(),
        name: 'Product 2',
        price: 19.99,
        description: 'Product description updated',
        sku: 'product-2',
      };

      const spy = jest.spyOn(updateProductCommandHandler, 'execute');

      commandBus.register([UpdateProductHandler]);
      eventBus.register([ProductUpdatedEventHandler]);

      const command = new UpdateProductCommand(updatedProduct);
      await commandBus.execute(command);

      expect(spy).toBeCalledWith(command);
    });
  });

  describe('ProductRemoveCommandHandler', () => {
    it('It should call the remove command trigger the right event', async () => {
      const toDeleteProduct: EventStoreData = {
        id: Math.random().toString(),
        name: 'Product 2',
        price: 19.99,
        description: 'Product description updated',
        sku: 'product-2',
        type: 'product',
        eventType: 'ProductUpdatedEvent',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const data = toDeleteProduct.id;

      const removeSpy = jest
        .spyOn(productRemovedEventHandler, 'handle')
        .mockImplementation();

      jest
        .spyOn(eventStore, 'findByIdOrThrow')
        .mockImplementation(() => Promise.resolve(toDeleteProduct));

      const spy = jest.spyOn(removeProductCommandHandler, 'execute');

      commandBus.register([RemoveProductHandler]);
      eventBus.register([ProductRemovedEventHandler]);

      const command = new RemoveProductCommand(data);
      await commandBus.execute(command);

      expect(spy).toBeCalledWith(command);
      expect(removeSpy).toBeCalledTimes(1);
    });
  });
});
