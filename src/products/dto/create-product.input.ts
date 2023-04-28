import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String, { description: 'Name of the product' })
  name: string;
  @Field(() => String, { description: 'SKU of the product', nullable: true })
  sku: string;
  @Field(() => Float, { description: 'Price of the product', nullable: true })
  price: number;
  @Field({ description: 'Description of the product', nullable: true })
  description: string;
}
