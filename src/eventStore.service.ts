import { Injectable, OnModuleInit } from '@nestjs/common';
// import crypto from 'crypto';
import { ApiError } from './exceptions/ApiError';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const base32 = require('base32');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

import { isEmpty } from 'lodash';

export interface EventStoreData {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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

  async create(type: string, eventType: string, data: any) {
    const newId = base32.encode(crypto.randomBytes(10));

    const newData = {
      id: newId,
      ...data,
      type: type,
      eventType: eventType,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.store.set(newId, [newData]);

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

    if (!data || data.at(-1).deletedAt) {
      throw new ApiError(404, 'Not found');
    }

    return data.at(-1);
  }

  async update(id: string, eventType: string, data: any) {
    const currentData = this.store.get(id) || [];

    if (isEmpty(currentData) || currentData.at(-1).deletedAt) {
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
    }));
  }

  async remove(id: string, eventType: string) {
    const currentData = this.store.get(id) || [];

    if (currentData.at(-1).deletedAt) {
      throw new ApiError(409, 'Already deleted');
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
