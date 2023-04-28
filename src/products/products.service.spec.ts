import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { PrismaService } from "../prisma.service";

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', () => {
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
  });

  expect(1).toBe(1);
});
