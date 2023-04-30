import { Product } from './products/entities/product.entity';
import { EventStoreService } from './eventStore.service';

describe('EventStore', () => {
  let eventStore: EventStoreService;

  beforeEach(async () => {
    eventStore = new EventStoreService();
  });

  it('should store an object', async () => {
    const newProduct: Partial<Product> = {
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    };

    const result = await eventStore.create('product', newProduct);

    expect(result.id).not.toBeNull();
  });

  it('to retrieve an object by id', async () => {
    const newProduct: Partial<Product> = {
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    };

    const result = await eventStore.create('product', newProduct);

    const { id } = result;

    const product = await eventStore.findByIdOrThrow(id);

    expect(product).not.toBeNull();
  });

  it('should update an object', async () => {
    const newProduct: Partial<Product> = {
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    };

    const result = await eventStore.create('product', newProduct);

    const { id } = result;

    // const product = await eventStore.findByIdOrThrow(id);

    const updatedProduct: Partial<Product> = {
      name: 'Product 2',
      price: 19.99,
      description: 'New Product description',
      sku: 'product-2',
    };

    await eventStore.update(id, updatedProduct);

    const latest = await eventStore.findByIdOrThrow(id);

    expect(latest).not.toBeNull();
    expect(latest).toEqual(expect.objectContaining(updatedProduct));

    console.log({ latest });

    const store = await eventStore.getStore();
    const allRecordsWithId = store.get(id);

    expect(allRecordsWithId.at(0)).toEqual(expect.objectContaining(newProduct));

    expect(allRecordsWithId.at(1)).toEqual(
      expect.objectContaining(updatedProduct),
    );
  });

  it('retrieve many objects', async () => {
    await eventStore.create('product', {
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    });

    await eventStore.create('product', {
      name: 'Product 2',
      price: 42,
      description: 'Product description',
      sku: 'product-2',
    });

    const products = await eventStore.findMany();

    console.log({ products });

    expect(products).not.toBeNull();
    expect(products).not.toHaveLength(1);
  });

  it('should delete an object', async () => {
    const product = await eventStore.create('product', {
      name: 'Product 1',
      price: 9.99,
      description: 'Product description',
      sku: 'product-1',
    });

    const foundProduct = await eventStore.findByIdOrThrow(product.id);

    expect(foundProduct).not.toBeNull();

    await eventStore.remove(product.id);

    const deletedProduct = await eventStore.findById(product.id);

    expect(deletedProduct).toBeNull();
  });
});
