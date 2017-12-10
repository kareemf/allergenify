import { Product } from '../src/models/product-model';
import { ProductsSaver, ProductsFetcher } from '../src/providers/products/products';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export class ProductsProviderMock implements ProductsFetcher, ProductsSaver {
  items: Product[];
  observable: Observable<Product[]>;
  subscriber: Subscriber<Product[]>;

  constructor() {
    this.observable = new Observable<Product[]>((subscriber) => {
      this.subscriber = subscriber;
    });
  }

  getItems(): Promise<Product[]> {
    return Promise.resolve(this.items);
  }

  save(items): Promise<any> {
    return Promise.resolve(this.items);
  }

  updates(): Observable<Product[]> {
    return this.observable;
  }
}
