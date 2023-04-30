import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => String, { description: 'Id of the product' })
  id: string;
  @Field(() => String, { description: 'Name of the product' })
  name: string;
  @Field(() => String, { description: 'SKU of the product', nullable: true })
  sku: string;
  @Field(() => Float, { description: 'Price of the product', nullable: true })
  price: number;
  @Field({ description: 'Description of the product', nullable: true })
  description: string;
}
