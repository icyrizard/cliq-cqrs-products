import { CreateProductHandler } from './create-product.handler';
import { UpdateProductHandler } from './update-product.handler';
import { RemoveProductHandler } from './remove-product.handler';

export const ProductCommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  RemoveProductHandler,
];
