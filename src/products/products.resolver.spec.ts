import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { PrismaService } from '../prisma.service';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsResolver, ProductsService, PrismaService],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
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

    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(newProduct));

    expect(
      await resolver.createProduct({
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      }),
    ).toBe(newProduct);
  });
});
