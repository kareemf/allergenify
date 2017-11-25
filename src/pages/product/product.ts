import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Product } from '../../models/product-model';
import { ProductsProvider } from '../../providers/products/products';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private product: Product;
  private onSave: (product: Product) => void;

  constructor(private navParams: NavParams, private productsProvider: ProductsProvider) {
    this.product = this.navParams.get('product');
    this.onSave = this.navParams.get('onSave');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

  removePicture(picture) {
    this.product.removePicture(picture);
    this.onSave(this.product);
  }

}
