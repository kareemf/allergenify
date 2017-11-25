// TODO: dedupe this code further
import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products/products';
import { Product } from '../../models/product-model';
import { ListPage } from '../list-page';
import { SaveDialogProvider } from '../../providers/save-dialog/save-dialog';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage extends ListPage {
  private products: Product[] = [];

  constructor(platform: Platform, private productsProvider: ProductsProvider,
              private saveDialogProvider: SaveDialogProvider) {
    super(platform, productsProvider);
    this.handleAddProduct = this.handleAddProduct.bind(this);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    super.ionViewDidLoad();
  }

  protected postDataLoad(items: Product[]) {
    this.products = items;
  }

  add(): void {
    this.saveDialogProvider.present('Add An Product', this.handleAddProduct);
  }

  private handleAddProduct(name: string): void {
    const product = new Product(name);

    this.products.push(product);
    this.save();
  }

  remove(product: Product): void {
    this
      .productsProvider
      .remove(product, this.products)
      .then((products: Product[]) => this.products = products);
  }

  private save() {
    this.productsProvider.save(this.products);
  }
}
