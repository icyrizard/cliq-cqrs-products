import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from './products.repository';
import { CommandBus, EventBus, EventPublisher, QueryBus } from '@nestjs/cqrs';
import { ProductEventHandlers } from './events/handlers';
import { ProductCommandHandlers } from './commands/handlers';
import { ProductQueryHandlers } from './queries/handlers';
import { ProductFactory } from './product.factory';
import { ProductCreatedEventHandler } from './events/handlers/product-created.event.handler';
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { Product } from '@prisma/client';
import { UpdateProductHandler } from './commands/handlers/update-product.handler';
import { ProductUpdatedEventHandler } from './events/handlers/product-updated.event.handler';
import { omit } from 'lodash';
import { RemoveProductHandler } from './commands/handlers/remove-product.handler';
import { ProductRemovedEventHandler } from './events/handlers/product-removed.event.handler';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let service: ProductsService;
  let repository: ProductsRepository;
  let commandBus: CommandBus;
  let eventBus: EventBus;

  let updateProductHandler: UpdateProductHandler;
  let createProductHandler: CreateProductHandler;
  let removeProductHandler: RemoveProductHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandBus,
        EventBus,
        QueryBus,
        PrismaService,
        ...ProductEventHandlers,
        ...ProductCommandHandlers,
        ...ProductQueryHandlers,
        ProductsResolver,
        ProductsService,
        PrismaService,
        ProductsRepository,
        ProductFactory,
        EventPublisher,
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
    eventBus = module.get<EventBus>(EventBus);
    commandBus = module.get<CommandBus>(CommandBus);

    updateProductHandler =
      module.get<UpdateProductHandler>(UpdateProductHandler);

    createProductHandler =
      module.get<CreateProductHandler>(CreateProductHandler);

    removeProductHandler =
      module.get<RemoveProductHandler>(RemoveProductHandler);

    jest.spyOn(repository, 'logEvent').mockImplementation(() => null);
  });

  // it('should trigger the correct commands and events when triggering createProduct', async () => {
  //   const newProduct: Product = {
  //     id: 1,
  //     name: 'Product 1',
  //     price: 9.99,
  //     description: 'Product description',
  //     sku: 'product-1',
  //     uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     deletedAt: null,
  //   };
  //
  //   const data = omit(newProduct, [
  //     'id',
  //     'uuid',
  //     'createdAt',
  //     'deletedAt',
  //     'updatedAt',
  //   ]);
  //
  //   commandBus.register([CreateProductHandler]);
  //   eventBus.register([ProductCreatedEventHandler]);
  //
  //   const spy = jest
  //     .spyOn(repository, 'create')
  //     .mockImplementation(() => Promise.resolve(newProduct));
  //
  //   expect(await resolver.createProduct(data)).toBe(newProduct);
  //
  //   expect(spy).toHaveBeenCalledWith(data);
  // });

  // it('should trigger the correct commands and events when triggering updateProduct', async () => {
  //   const updatedProduct: Product = {
  //     id: 1,
  //     name: 'Product 2',
  //     price: 19.99,
  //     description: 'Product description updated',
  //     sku: 'product-2',
  //     uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     deletedAt: null,
  //   };
  //
  //   const data = omit(updatedProduct, [
  //     'uuid',
  //     'createdAt',
  //     'deletedAt',
  //     'updatedAt',
  //   ]);
  //
  //   jest.spyOn(updateProductHandler, 'execute');
  //
  //   commandBus.register([UpdateProductHandler]);
  //   eventBus.register([ProductUpdatedEventHandler]);
  //
  //   const spy = jest
  //     .spyOn(repository, 'update')
  //     .mockImplementation(() => Promise.resolve(updatedProduct));
  //
  //   expect(await resolver.updateProduct(data)).toBe(updatedProduct);
  //   expect(spy).toHaveBeenCalledWith(updatedProduct.id, data);
  //
  //   expect(updateProductHandler.execute).toHaveBeenCalledTimes(1);
  // });
  //
  // it('should trigger the correct commands and events when triggering removeProduct', async () => {
  //   const toDeleteProduct: Product = {
  //     id: 1,
  //     name: 'Product 2',
  //     price: 19.99,
  //     description: 'Product description updated',
  //     sku: 'product-2',
  //     uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     deletedAt: null,
  //   };
  //
  //   const data = toDeleteProduct.id;
  //
  //   jest.spyOn(removeProductHandler, 'execute');
  //
  //   commandBus.register([RemoveProductHandler]);
  //   eventBus.register([ProductRemovedEventHandler]);
  //
  //   const spy = jest
  //     .spyOn(repository, 'remove')
  //     .mockImplementation(() => Promise.resolve(toDeleteProduct));
  //
  //   // jest.spyOn(repository, 'logEvent').mockImplementation(() => {
  //   //   id: 1,
  //   //     name: 'Log',
  //   // });
  //
  //   expect(await resolver.removeProduct(data)).toBe(toDeleteProduct);
  //
  //   expect(spy).toHaveBeenCalledWith(data);
  //
  //   expect(removeProductHandler.execute).toHaveBeenCalledTimes(1);
  // });
});
