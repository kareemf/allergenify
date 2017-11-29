import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { OcrProvider } from '../../providers/ocr/ocr';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider } from '../../providers/product/product';

@IonicPage({
  defaultHistory: ['ProductsPage'],
  segment: 'products/:slug'
})
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private product: Product = Product.from({});
  private onPicture: (product: Product) => void;

  constructor(private navParams: NavParams, private ocrProvider: OcrProvider, private productProvider: ProductProvider,
              private allergensProvider: AllergensProvider, private alerter: GenericAlerter,) {
    this.onPicture = this.navParams.get('onPicture');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');

    const slug = this.navParams.get('slug');

    this
      .productProvider
      .getItem(slug)
      .then(product => this.handleProductLoad(product))
      .catch(error => this.handleProductLoadError(error, slug));
  }

  handleProductLoad(product: Product) {
    console.log(`loaded product ${product}`);
    this.product = product;
  }

  private handleProductLoadError(error: any, slug: string) {
    const message = `Failed to load product ${slug}`
    this.logAndPresentError(error, message.toLowerCase(), message);
  }

  private logAndPresentError(error: any, logMessage: string, displasyMessasge: string): void {
    console.error(logMessage, error);

    this.alerter.presentError(displasyMessasge);
  }

  presentEdit(): void {
    this
      .alerter
      .presentRename(this.product, () => this.save());
  }

  addPicture(): void {
    this.onPicture(this.product);
  }

  removePicture(picture: Picture): void {
    this.product.removePicture(picture);
    this.save();
  }

  save() {
    this.productProvider.save(this.product);
  }

  viewText(picture: Picture): void {
    const title: string = `Text Extracted From ${picture.name}`;

    this.alerter.present(title, picture.text);
  }

  scanPicture(picture: Picture): void {
    console.log('scanning picture', picture);

    this.product.dateScanned = new Date();

    this
      .ocrProvider
      .extractText(picture)
      .then(text => this.handleTextExtraction(picture, text))
      .catch(error => this.handleTextExtractionError(error));
  }

  private handleTextExtraction(picture: Picture, text: string): void {
    console.log("text extraction produced", text);

    picture.text = text;

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
    this.save();
  }

  private handleAllergenCheckError(error: any): void {
    this.logAndPresentError(error,'allergen check error', 'Failed to process image');

  }

  private handleTextExtractionError(error: any): void {
    this.logAndPresentError(error,'text extraction error', 'Failed to process text from image');
  }

}
