import { Product } from './products/entities/product.entity';
import { DataWithId, EventStoreService } from './event-store.service';
import { EventsEnum } from './products/common/events.enum';

describe('EventStore', () => {
  let eventStore: EventStoreService;

  beforeEach(async () => {
    eventStore = new EventStoreService();
  });

  it('should store an object', async () => {
    const newProduct: DataWithId = {
      id: Math.random().toString(),
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    };

    const result = await eventStore.create(
      'product',
      EventsEnum.ProductCreated,
      newProduct,
    );

    expect(result.id).not.toBeNull();
  });

  it('to retrieve an object by id', async () => {
    const newProduct: DataWithId = {
      id: Math.random().toString(),
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    };

    const result = await eventStore.create(
      'product',
      EventsEnum.ProductCreated,
      newProduct,
    );

    const { id } = result;

    const product = await eventStore.findByIdOrThrow(id);

    expect(product).not.toBeNull();
  });

  it('should update an object', async () => {
    const newProduct: DataWithId = {
      id: Math.random().toString(),
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    };

    const result = await eventStore.create(
      'product',
      EventsEnum.ProductCreated,
      newProduct,
    );

    const { id } = result;

    // const product = await eventStore.findByIdOrThrow(id);

    const updatedProduct: Partial<Product> = {
      name: 'Product 2',
      price: 19.99,
      description: 'New Product description',
      sku: 'product-2',
    };

    await eventStore.update(id, EventsEnum.ProductUpdated, updatedProduct);

    const latest = await eventStore.findByIdOrThrow(id);

    expect(latest).not.toBeNull();
    expect(latest).toEqual(expect.objectContaining(updatedProduct));

    const store = await eventStore.getStore();
    const allRecordsWithId = store.get(id);

    expect(allRecordsWithId.at(0)).toEqual(expect.objectContaining(newProduct));

    expect(allRecordsWithId.at(1)).toEqual(
      expect.objectContaining(updatedProduct),
    );
  });

  it('retrieve many objects', async () => {
    await eventStore.create('product', EventsEnum.ProductCreated, {
      id: Math.random().toString(),
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    });

    await eventStore.create('product', EventsEnum.ProductCreated, {
      id: Math.random().toString(),
      name: 'Product 2',
      price: 42,
      description: 'Product description',
      sku: 'product-2',
    });

    const products = await eventStore.findMany();

    expect(products).not.toBeNull();
    expect(products).not.toHaveLength(1);
  });

  it('should delete an object', async () => {
    const product = await eventStore.create(
      'product',
      EventsEnum.ProductCreated,
      {
        id: Math.random().toString(),
        name: 'Product 1',
        price: 9.99,
        description: 'Product description',
        sku: 'product-1',
      },
    );

    const foundProduct = await eventStore.findByIdOrThrow(product.id);

    expect(foundProduct).not.toBeNull();

    await eventStore.remove(product.id, EventsEnum.ProductRemoved);

    const deletedProduct = await eventStore.findById(product.id);

    expect(deletedProduct).toBeNull();
  });
});
