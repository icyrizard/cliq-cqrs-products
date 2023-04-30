import { CreateProductInputWithId } from './dto/create-product.input';
import { ProductsRepository } from './products.repository';
import { UpdateProductInput } from './dto/update-product.input';

export class ProductFactory {
  constructor(private productRepository: ProductsRepository) {}

  // async update(input: UpdateProductInput) {
  //   const updatedProduct = await this.productRepository.create(input);
  //
  //   updatedProduct.update();
  //
  //   return updatedProduct;
  // }

  async create(input: CreateProductInputWithId) {
    console.log(this.productRepository);
    const newProduct = await this.productRepository.create(input);

    console.log('newProduct', newProduct);
    newProduct.create();
    // newProduct.apply(new ProductCreatedEvent(newProduct));

    return newProduct;
  }
}
