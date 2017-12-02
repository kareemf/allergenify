import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Picture } from '../../models/picture-model';
import { Product } from '../../models/product-model';

@IonicPage()
@Component({
  selector: 'page-picture-extracted-text',
  templateUrl: 'picture-extracted-text.html',
})
export class PictureExtractedTextPage {
  picture: Picture;
  allergenNames: string[];

  constructor(private viewController: ViewController, private navParams: NavParams) {
    const product: Product = this.navParams.get('product');
    this.picture = this.navParams.get('picture');
    //CONSIDER: tell dont ask on product
    this.allergenNames = product.allergens.map(allergen => allergen.name.toLowerCase());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PictureExtractedTextPage');
  }

  // TODO: memoize
  //CONSIDER: tell dont ask on product
  isAllergenMatch(word: string): boolean {
    return !!this.allergenNames.find(name => name == word.toLowerCase());
  }

  close(): void {
    this.viewController.dismiss();
  }

}
