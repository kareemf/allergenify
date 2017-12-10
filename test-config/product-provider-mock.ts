import { Product } from '../src/models/product-model';
import { ProductsSaver, ProductsFetcher } from '../src/providers/products/products';
import { Observable } from 'rxjs/Observable';

export class ProductsProviderMock implements ProductsFetcher, ProductsSaver {
  getItems(): Promise<Product[]> {
    return Promise.resolve([]);
  }

  save(items): Promise<any> {
    return Promise.resolve([]);
  }

  updates(): Observable<Product[]> {
    return new Observable<Product[]>();
  }
}
