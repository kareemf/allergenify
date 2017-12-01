import { Observable } from "rxjs/Observable"
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageDataProvider } from '../storage-data';
import { Product } from '../../models/product-model';
import { Subscriber } from "rxjs/Subscriber";

@Injectable()
export class ProductsProvider extends StorageDataProvider {
  observable: Observable<Product[]>;
  subscriber: Subscriber<Product[]>;

  constructor(storage: Storage) {
    super(storage, 'products');

    this.observable = new Observable<Product[]>((subscriber) => {
      this.subscriber = subscriber;
    });
  }

  getItems(): Promise<Product[]> {
    return super._getItems<Product>(Product.from);
  }

  save<Product>(items): void {
    super.save(items);
    this.subscriber.next(items);
  }

  updates(): Observable<Product[]> {
    return this.observable;
  }
}
