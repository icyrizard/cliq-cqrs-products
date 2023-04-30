import { Injectable, OnModuleInit } from '@nestjs/common';
import { isEmpty } from 'lodash';

export interface EventStoreData {
  id: string;
  type: string;
  eventType: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  [key: string]: any;
}

export interface DataWithId {
  id: string;
  [key: string]: any;
}

@Injectable()
export class EventStoreService implements OnModuleInit {
  private store: Map<string, EventStoreData[]>;

  constructor() {
    this.store = new Map();
  }

  async onModuleInit() {
    console.log('EventStoreService initialized');
  }

  async getStore() {
    return this.store;
  }

  async create(type: string, eventType: string, data: DataWithId) {
    const newData = {
      ...data,
      type: type,
      eventType: eventType,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const { id } = newData;

    this.store.set(id, [newData]);

    return newData;
  }

  async findById(id: string) {
    const data = this.store.get(id) || [];

    if (!data || data.at(-1).deletedAt) {
      return null;
    }

    return data.at(-1) || null;
  }

  async findByIdOrThrow(id: string) {
    const data = this.store.get(id);

    if (isEmpty(data) || data.at(-1).deletedAt) {
      // throw new HttpException('Not found', HttpStatus.FORBIDDEN);
      console.log('Not found', id, data);

      return;
    }

    return data.at(-1);
  }

  async update(id: string, eventType: string, data: any) {
    const currentData = this.store.get(id) || [];

    if (isEmpty(currentData) || currentData.at(-1).deletedAt) {
      console.log('Not found for update', id, currentData);
      // throw new HttpException('Not found', HttpStatus.FORBIDDEN);
      return;
    }

    const newData = {
      id: id,
      ...currentData.at(0),
      ...data,
      eventType: eventType,
      updatedAt: new Date(),
      // always undelete when updated.
      deletedAt: null,
    };

    this.store.set(id, [...currentData, newData]);

    return newData;
  }

  async findMany() {
    return Array.from(this.store, ([id, value]) => ({
      id,
      ...value.at(-1),
    })).filter((data) => !data.deletedAt);
  }

  async remove(id: string, eventType: string) {
    const currentData = this.store.get(id) || [];

    if (isEmpty(currentData) || currentData.at(-1).deletedAt) {
      console.log('Not found for removal', id, currentData);
      // throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      return;
    }

    const newData = {
      id: id,
      eventType: eventType,
      ...currentData.at(0),
      deletedAt: new Date(),
    };

    this.store.set(id, [...currentData, newData]);

    return newData;
  }
}
