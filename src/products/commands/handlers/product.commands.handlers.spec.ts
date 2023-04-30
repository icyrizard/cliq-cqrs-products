import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus, EventPublisher } from '@nestjs/cqrs';
import { Product } from '@prisma/client';
import { omit } from 'lodash';

import { ProductsRepository } from '../../products.repository';
import { PrismaService } from '../../../prisma.service';

import { CreateProductCommand } from '../impl/create-product.command';
import { CreateProductHandler } from './create-product.handler';
import { ProductFactory } from '../../product.factory';
import { ProductCreatedEventHandler } from '../../events/handlers/product-created.event.handler';
import { ProductCommandHandlers } from './index';
import { ProductEventHandlers } from '../../events/handlers';
import { UpdateProductHandler } from './update-product.handler';
import { RemoveProductHandler } from './remove-product.handler';
import { EventStoreService } from '../../../eventStore.service';

describe('ProductCommands', function () {
  let commandBus: CommandBus;
  let eventBus: EventBus;
  let createProductCommandHandler: CreateProductHandler;
  let updateProductCommandHandler: UpdateProductHandler;
  let removeProductCommandHandler: RemoveProductHandler;
  let productFactory: ProductFactory;
  let repository: ProductsRepository;
  let logEventSpy: jest.SpyInstance;
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

    productFactory = module.get<ProductFactory>(ProductFactory);
    repository = module.get<ProductsRepository>(ProductsRepository);
    eventStore = module.get<EventStoreService>(EventStoreService);

    // logEventSpy = jest.spyOn(repository, 'logEvent').mockImplementation();
  });

  describe('ProductCreatedCommandHandler', () => {
    it('It should create a product and trigger an event', async () => {
      const newProduct: Product = {
        id: 1,
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
        uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const data = omit(newProduct, [
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ]);

      const spy = jest.spyOn(createProductCommandHandler, 'execute');

      // jest
      //   .spyOn(repository, 'create')
      //   .mockImplementation(() => Promise.resolve(newProduct));

      commandBus.register([CreateProductHandler]);
      eventBus.register([ProductCreatedEventHandler]);

      const command = new CreateProductCommand(data);
      await commandBus.execute(command);

      expect(spy).toBeCalledWith(command);
    });
  });

  // describe('ProductUpdateCommandHandler', () => {
  //   it('It should update a product and trigger an event', async () => {
  //     const updatedProduct: Product = {
  //       id: 1,
  //       name: 'Product 2',
  //       price: 19.99,
  //       description: 'Product description updated',
  //       sku: 'product-2',
  //       uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       deletedAt: null,
  //     };
  //
  //     const data = omit(updatedProduct, [
  //       'createdAt',
  //       'updatedAt',
  //       'deletedAt',
  //     ]);
  //
  //     const spy = jest.spyOn(updateProductCommandHandler, 'execute');
  //
  //     jest
  //       .spyOn(repository, 'update')
  //       .mockImplementation(() => Promise.resolve(updatedProduct));
  //
  //     commandBus.register([UpdateProductHandler]);
  //     eventBus.register([ProductUpdatedEventHandler]);
  //
  //     const command = new UpdateProductCommand(data);
  //     await commandBus.execute(command);
  //
  //     expect(spy).toBeCalledWith(command);
  //     expect(logEventSpy).toBeCalledWith(updatedProduct.id, 'updated');
  //   });
  // });
  //
  // describe('ProductRemoveCommandHandler', () => {
  //   it('It should update a product and trigger an event', async () => {
  //     const toDeleteProduct: Product = {
  //       id: 1,
  //       name: 'Product 2',
  //       price: 19.99,
  //       description: 'Product description updated',
  //       sku: 'product-2',
  //       uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       deletedAt: null,
  //     };
  //
  //     const data = toDeleteProduct.id;
  //
  //     const spy = jest.spyOn(removeProductCommandHandler, 'execute');
  //
  //     jest
  //       .spyOn(repository, 'remove')
  //       .mockImplementation(() => Promise.resolve(toDeleteProduct));
  //
  //     commandBus.register([RemoveProductHandler]);
  //     eventBus.register([ProductRemovedEventHandler]);
  //
  //     const command = new RemoveProductCommand(data);
  //     await commandBus.execute(command);
  //
  //     expect(spy).toBeCalledWith(command);
  //     expect(logEventSpy).toBeCalledWith(toDeleteProduct.id, 'removed');
  //   });
  // });
});
