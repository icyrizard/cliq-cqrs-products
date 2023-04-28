import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int, { description: 'Id of the product' })
  id: number;
  @Field(() => String, { description: 'UUId of the product' })
  uuid: number;
  @Field(() => String, { description: 'Name of the product' })
  name: string;
  @Field(() => String, { description: 'SKU of the product', nullable: true })
  sku: string;
  @Field(() => Float, { description: 'Price of the product', nullable: true })
  price: number;
  @Field({ description: 'Description of the product', nullable: true })
  description: string;
}
