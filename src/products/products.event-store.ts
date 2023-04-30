import { UpdateProductInput } from './dto/update-product.input';
import { Injectable } from '@nestjs/common';
import { ApiError } from '../exceptions/ApiError';
import { EventStoreService } from '../eventStore.service';
import { Product } from './entities/product.entity';
import { CreateProductInputWithId } from './dto/create-product.input';

@Injectable()
export class ProductsEventStore {
  constructor(private eventStore: EventStoreService) {}

  async create(eventType: string, data: CreateProductInputWithId) {
    return this.eventStore.create('product', eventType, data);
  }

  // async findAll(query) {
  //   return await this.eventStore.findMany();
  // }
  //
  // async findOne(id: string) {
  //   return await this.eventStore.findByIdOrThrow(id);
  // }

  async update(id: string, eventType, updateProductInput: UpdateProductInput) {
    try {
      return await this.eventStore.update(id, eventType, updateProductInput);
    } catch (error) {
      throw new ApiError(409, 'Unable to update this product');
    }
  }
  //
  // async remove(id: string) {
  //   try {
  //     return await this.eventStore.remove(id);
  //   } catch (error) {
  //     throw new ApiError(409, 'Unable to remove this product');
  //   }
  // }

  // async logEvent(id: number, name: string) {
  // return await this.prisma.eventLog.create({
  //   data: {
  //     name: name,
  //     modelId: id,
  //     modelName: 'Product',
  //   },
  // });
  // }
}
