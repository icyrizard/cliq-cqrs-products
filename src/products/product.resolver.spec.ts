import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus, EventPublisher, QueryBus } from '@nestjs/cqrs';

import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { FindByIdProductQuery } from './queries/impl/find-by-id-product.query';
import { ProductQueryHandlers } from './queries/handlers';
import { ProductCommandHandlers } from './commands/handlers';
import { ProductsRepository } from './products.repository';
import { EventStoreService } from '../event-store.service';
import { EventHandlers } from './products.module';
import { FindByIdProductsHandler } from './queries/handlers/find-by-id-products.handler';
import { FindAllProductsQuery } from './queries/impl/find-all-products.query';
import { FindAllProductsHandler } from './queries/handlers/find-all-products.handler';
import { CreateProductCommand } from './commands/impl/create-product.command';
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { CreateProductInputWithId } from './dto/create-product.input';
import { RemoveProductCommand } from './commands/impl/remove-product.command';
import { RemoveProductHandler } from './commands/handlers/remove-product.handler';

describe('ProductCommands', function () {
  let queryBus: QueryBus;
  let resolver: ProductsResolver;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ...EventHandlers,
        ...ProductCommandHandlers,
        ...ProductQueryHandlers,
        ProductsResolver,
        ProductsService,
        CommandBus,
        QueryBus,
        EventBus,
        EventPublisher,
        ProductsRepository,
        EventStoreService,
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);

    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('GetProductById', () => {
    it('should retrieve a product by Id - call the right queryBus', async () => {
      const spy = jest.spyOn(queryBus, 'execute').mockImplementation();

      queryBus.register([FindByIdProductsHandler]);

      await resolver.findOne('1');

      expect(spy).toHaveBeenCalledWith(new FindByIdProductQuery('1'));
    });
  });

  describe('GetProducts', () => {
    it('should retrieve all products - call the right queryBus', async () => {
      const spy = jest.spyOn(queryBus, 'execute').mockImplementation();

      queryBus.register([FindAllProductsHandler]);

      await resolver.findAll();

      expect(spy).toHaveBeenCalledWith(new FindAllProductsQuery());
    });
  });

  describe('Create a product', () => {
    it('should create a new product - call the right command bus', async () => {
      const product: CreateProductInputWithId = {
        id: Math.random().toString(),
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      };

      const spy = jest.spyOn(commandBus, 'execute').mockImplementation();

      commandBus.register([CreateProductHandler]);

      await resolver.createProduct(product);

      expect(spy).toHaveBeenCalledWith(new CreateProductCommand(product));
    });
  });

  describe('Remove a product', () => {
    it('Remove a product - call the right command bus', async () => {
      const productId = Math.random().toString();

      const spy = jest.spyOn(commandBus, 'execute').mockImplementation();

      commandBus.register([RemoveProductHandler]);

      await resolver.removeProduct(productId);

      expect(spy).toHaveBeenCalledWith(new RemoveProductCommand(productId));
    });
  });
});
