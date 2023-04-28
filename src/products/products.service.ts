import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
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
    return await this.prisma.product.updateMany({
      where: {
        id: id,
        deletedAt: null,
      },
      data: updateProductInput,
    });
  }

  async remove(id: number) {
    return await this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
