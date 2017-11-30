import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
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

  constructor(public navParams: NavParams) {
    const product: Product = this.navParams.get('product');
    this.picture = this.navParams.get('picture');
    //CONSIDER: tell dont ask on product
    this.allergenNames = product.allergens.map(allergen => allergen.name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PictureExtractedTextPage');
  }

  isAllergenMatch(word: string): boolean {
    return !!this.allergenNames.find(name => name == word);
  }

}
