import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Product } from '../../models/product-model';
import { ProductsProvider } from '../../providers/products/products';
import { Picture } from '../../models/picture-model';
import { OcrProvider } from '../../providers/ocr/ocr';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private product: Product;
  private onSave: (product: Product) => void;

  constructor(private navParams: NavParams, private productsProvider: ProductsProvider, private ocrProvider: OcrProvider) {
    this.product = this.navParams.get('product');
    this.onSave = this.navParams.get('onSave');
  }

  //TODO: edit name and add picture from this screen

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

  removePicture(picture: Picture) {
    this.product.removePicture(picture);
    this.onSave(this.product);
  }

  scanPicture(picture: Picture): void {
    console.log('scanning picture', picture);

    this
      .ocrProvider
      .extractText(picture)
      .then(text => this.handleTextExtraction(text))
      .catch(error => this.handleTextExtractionError(error));
  }

  private handleTextExtractionError(text: string): void {
    console.log("text extraction produced", text);

  }

  private handleTextExtraction(error: any): void {
    console.error("text extraction error", error);
  }

}
