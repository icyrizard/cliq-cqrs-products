import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus, EventPublisher, QueryBus } from '@nestjs/cqrs';

import { ProductsRepository } from '../../products.repository';
import { PrismaService } from '../../../prisma.service';
import { FindByIdProductQuery } from '../impl/find-by-id-product.query';
import { FindByIdProductsHandler } from './find-by-id-products.handler';
import { ProductQueryHandlers } from './index';
import { FindAllProductsHandler } from './find-all-products.handler';
import { FindAllProductsQuery } from '../impl/find-all-products.query';

import { EventStoreData, EventStoreService } from '../../../eventStore.service';

describe('ProductCommands', function () {
  let queryBus: QueryBus;
  let repository: ProductsRepository;
  let findProductByIdQueryHandler: FindByIdProductsHandler;
  let findAllProductsQueryHandler: FindAllProductsHandler;
  let eventStore: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...ProductQueryHandlers,
        PrismaService,
        ProductsRepository,
        EventBus,
        CommandBus,
        EventPublisher,
        QueryBus,
        EventStoreService,
      ],
    }).compile();

    queryBus = module.get<QueryBus>(QueryBus);
    repository = module.get<ProductsRepository>(ProductsRepository);

    findProductByIdQueryHandler = module.get<FindByIdProductsHandler>(
      FindByIdProductsHandler,
    );

    findAllProductsQueryHandler = module.get<FindAllProductsHandler>(
      FindAllProductsHandler,
    );

    eventStore = module.get<EventStoreService>(EventStoreService);
  });

  describe('GetProductById', () => {
    it('It retrieve a product by Id', async () => {
      const product: EventStoreData = {
        id: Math.random().toString(),
        name: 'Product 1',
        type: 'product',
        eventType: 'ProductCreatedEvent',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const spy = jest.spyOn(findProductByIdQueryHandler, 'execute');
      queryBus.register([FindByIdProductsHandler]);

      jest
        .spyOn(eventStore, 'findByIdOrThrow')
        .mockImplementation(() => Promise.resolve(product));

      const query = new FindByIdProductQuery(product.id);

      const retrievedProduct = await queryBus.execute(query);

      expect(retrievedProduct).toEqual(product);
      expect(spy).toHaveBeenCalledWith(query);
    });
  });

  describe('GetAllProducts', () => {
    it('It retrieve all products', async () => {
      const products: EventStoreData[] = [
        {
          id: Math.random().toString(),
          name: 'Product 1',
          type: 'product',
          eventType: 'ProductCreatedEvent',
          price: 9.99,
          description: 'Product description',
          sku: 'product-1',
          uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const spy = jest.spyOn(findAllProductsQueryHandler, 'execute');
      queryBus.register([FindAllProductsHandler]);

      jest
        .spyOn(repository, 'findAll')
        .mockImplementation(() => Promise.resolve(products));

      const query = new FindAllProductsQuery();

      const retrievedProduct = await queryBus.execute(query);

      expect(retrievedProduct).toEqual(products);
      expect(spy).toHaveBeenCalledWith(query);
    });
  });
});
