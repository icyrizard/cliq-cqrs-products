import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int, { description: 'Id of the product' })
  id: number;
  @Field(() => String, { description: 'UUId of the product' })
  name: string;
  @Field(() => String, { description: 'SKU of the product', nullable: true })
  sku: string;
  @Field(() => Float, { description: 'Price of the product', nullable: true })
  price: number;
  @Field({ description: 'Description of the product' })
  description: string;
  @Field({ description: 'Creation date of the product' })
  createdAt: Date;
  @Field({ description: 'Updated date of the product' })
  updatedAt: Date;
  @Field({ description: 'Deletion date of the product', nullable: true })
  deletedAt: Date;
}
