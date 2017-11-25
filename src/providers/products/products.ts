import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageDataProvider } from '../storage-data';
import { Product } from '../../models/product-model';

@Injectable()
export class ProductsProvider extends StorageDataProvider {

  constructor(storage: Storage) {
    super(storage, 'products');
    console.log('Hello ProductsProvider');
  }

  getProducts(): Promise<Product[]> {
    return super.getItems();
  }

  protected handleDataLoaded(jsonText: string): Product[] {
    return super.handleDataLoaded(jsonText, Product.from);
  }
}
