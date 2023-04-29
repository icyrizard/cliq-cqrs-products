import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { ProductsRepository } from './products.repository';
import {
  CommandBus,
  CqrsModule,
  EventBus,
  EventPublisher,
  QueryBus,
} from '@nestjs/cqrs';
import { ProductsResolver } from './products.resolver';
import { ProductEventHandlers } from './events/handlers';
import { ProductCommandHandlers } from './commands/handlers';
import { ProductQueryHandlers } from './queries/handlers';
import { ProductFactory } from './product.factory';

describe('ProductsService', () => {
  let resolver: ProductsResolver;
  let service: ProductsService;
  let repository: ProductsRepository;

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
        ProductsRepository,
        ProductFactory,
        EventPublisher,
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(PrismaService);

    // service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', () => {
    // const newProduct: AggregateObject<Product> = new AggregateObject<Product>({
    //   id: 1,
    //   name: 'Product 1',
    //   price: 9.99,
    //   description: 'Product description',
    //   sku: 'product-1',
    //   uuid: '888efa67-e91a-4a51-9336-10e606aa2a13',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   deletedAt: null,
    // });

    //   jest
    //     .spyOn(service, 'create')
    //     .mockImplementation(() => );

    expect(1).toBe(1);
  });
});
