import { Injectable } from '@angular/core';
import { ProductsProvider } from '../products/products';
import { Product } from '../../models/product-model';

@Injectable()
export class ProductProvider {

  constructor(private productsProvider: ProductsProvider) {
    console.log('Hello ProductProvider Provider');
  }

  getItem(slug: string): Promise<Product> {
    return this
      .productsProvider
      .getItems()
      .then((products: Product[]) => this.pluckItem(slug, products));
  }

  private pluckItem(slug: string, items: Product[]): Product {
    const item = items.find(item => item.slug === slug);

    if (item){ return item; }

    throw new Error(`Unable to find ${slug} in ${items}`);
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
