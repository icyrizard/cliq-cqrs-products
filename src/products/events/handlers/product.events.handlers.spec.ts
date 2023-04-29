import { Test, TestingModule } from '@nestjs/testing';
import { ProductEventHandlers } from './index';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ProductCreatedEvent } from '../impl/product-created.event';
import { ProductCreatedEventHandler } from './product-created.event.handler';
import { ProductsRepository } from '../../products.repository';
import { PrismaService } from '../../../prisma.service';

import { EventLog } from '@prisma/client';
import { ProductsService } from '../../products.service';

describe('ProductEventHandlers', function () {
  let productCreatedEventHandler: ProductCreatedEventHandler;
  let productsRepository: ProductsRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCreatedEventHandler,
        PrismaService,
        ProductsRepository,
        EventBus,
        CommandBus,
      ],
    }).compile();

    eventBus = module.get<EventBus>(EventBus);

    productCreatedEventHandler = module.get<ProductCreatedEventHandler>(
      ProductCreatedEventHandler,
    );

    productsRepository = module.get<ProductsRepository>(ProductsRepository);
  });

  describe('ProductCreatedEventHandler', () => {
    it('It should log the event', async () => {
      const spy = jest.spyOn(productCreatedEventHandler, 'handle');

      eventBus.register([ProductCreatedEventHandler]);

      const event = new ProductCreatedEvent(1);

      jest.spyOn(productsRepository, 'logEvent').mockImplementation(() =>
        Promise.resolve<EventLog>({
          id: 1,
          name: 'created',
          modelId: 1,
          modelName: 'Product',
          updatedAt: new Date(),
          createdAt: new Date(),
        }),
      );

      await eventBus.publish(event);

      expect(spy).toBeCalledWith(event);
    });
  });
});
