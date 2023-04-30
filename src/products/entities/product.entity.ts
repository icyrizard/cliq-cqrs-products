import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AggregateRoot } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../events/impl/product-created.event';
import { CreateProductInputWithId } from '../dto/create-product.input';
import { ProductUpdatedEvent } from '../events/impl/product-updated.event';
import { ProductRemovedEvent } from '../events/impl/product-removed.event';

@ObjectType()
export class Product extends AggregateRoot {
  data: CreateProductInputWithId;

  @Field(() => String, { description: 'Id of the product' })
  id: string;
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

  setData(data: CreateProductInputWithId) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  create() {
    this.apply(new ProductCreatedEvent(this.data));
  }

  update() {
    this.apply(new ProductUpdatedEvent(this.data));
  }

  remove() {
    this.apply(new ProductRemovedEvent(this.id));
  }
}
