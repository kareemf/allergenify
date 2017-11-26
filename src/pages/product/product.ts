import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { OcrProvider } from '../../providers/ocr/ocr';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private product: Product;
  private onSave: (product: Product) => void;

  constructor(private navParams: NavParams, private ocrProvider: OcrProvider,
              private allergensProvider: AllergensProvider, private alerter: GenericAlerter,) {
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

  private handleTextExtraction(text: string): void {
    console.log("text extraction produced", text);

    this
      .allergensProvider
      .checkForAllergens(text)
      .then((allergens: Allergen[]) => this.handleAllergenCheck(allergens))
      .catch(error => this.handleAllergenCheckError(error));
  }

  private handleAllergenCheck(allergens: Allergen[]): void {
    console.log("allergen check results", allergens);

    if(!allergens.length) {
      this.alerter.presentConfirmation("No allergens found!");
    } else {
      this.presentAllergensDetected(allergens);
      this.handleAllergensFound(allergens);
    }
  }

  private presentAllergensDetected(allergens: Allergen[]) {
    const title = 'Allergens Detected';
    const message = `Found ${allergens.length} allergens:\n ${allergens.map(allergen => allergen.name + '\n')}`;

    this
      .alerter
      .present(title, message);
  }

  private handleAllergensFound(allergens: Allergen[]): void {
    this.product.allergens = allergens;
    this.onSave(this.product);
  }

  private handleAllergenCheckError(error: any): void {
    console.error("allergen check error", error);

    this.alerter.presentError('Failed to process image');
  }

  private handleTextExtractionError(error: any): void {
    console.error("text extraction error", error);

    this.alerter.presentError('Failed to process text from image');
  }

}
