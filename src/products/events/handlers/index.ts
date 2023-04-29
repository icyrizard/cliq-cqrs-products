import { ProductUpdatedEventHandler } from './product-updated.event.handler';
import { ProductRemovedEventHandler } from './product-removed.event.handler';
import { ProductCreatedEventHandler } from './product-created.event.handler';

export const ProductEventHandlers = [
  ProductCreatedEventHandler,
  ProductUpdatedEventHandler,
  ProductRemovedEventHandler,
];
