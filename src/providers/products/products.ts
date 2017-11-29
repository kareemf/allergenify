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

  getItems(): Promise<Product[]> {
    return super._getItems<Product>(Product.from);
  }

  getItem(slug: string): Promise<Product> {
    return this
      .getItems()
      .then((products: Product[]) => this.geItem(slug, products));
  }

  private geItem(slug: string, items: Product[]): Product {
    const item = items.find(item => item.slug === slug);

    if (item){ return item; }

    throw new Error(`Unable to find ${slug} in ${items}`);
  }
}
