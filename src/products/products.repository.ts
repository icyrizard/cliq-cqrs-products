import { PrismaService } from '../prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Injectable } from '@nestjs/common';
import { ApiError } from '../exceptions/ApiError';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createProductInput: CreateProductInput) {
    return await this.prisma.product.create({
      data: createProductInput,
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.product.findFirstOrThrow({
      where: {
        id: id,
        deletedAt: null,
      },
    });
  }

  async update(id: number, updateProductInput: UpdateProductInput) {
    try {
      return await this.prisma.product.update({
        where: {
          id: id,
        },
        data: updateProductInput,
      });
    } catch (error) {
      throw new ApiError(409, 'Unable to update this product');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.product.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new ApiError(409, 'Unable to remove this product');
    }
  }

  async logEvent(id: number, name: string) {
    return await this.prisma.eventLog.create({
      data: {
        name: name,
        modelId: id,
        modelName: 'Product',
      },
    });
  }
}
