import { Injectable } from '@angular/core';
import { ProductsProvider } from '../products/products';
import { Product } from '../../models/product-model';

@Injectable()
export class ProductProvider {

  constructor(private productsProvider: ProductsProvider) {
    console.log('Hello ProductProvider Provider');
  }

  getItem(id: string): Promise<Product> {
    return this
      .productsProvider
      .getItems()
      .then((products: Product[]) => this.pluckItem(id, products));
  }

  private pluckItem(id: string, items: Product[]): Product {
    const item = items.find(item => item.id === id);

    if (item){ return item; }

    throw new Error(`Unable to find ${id} in ${items}`);
  }

  save(product: Product) {
    console.log(`saving product ${product}`);

    return this
      .productsProvider
      .getItems()
      .then((products: Product[]) => this.updateItem(product, products));
  }

  private updateItem(item: Product, items: Product[]) {
    const updatedItems = items.map(_item => _item.id === item.id ? item : _item);
    this.productsProvider.save(updatedItems);
  }
}
