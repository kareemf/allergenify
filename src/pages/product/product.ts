import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, Platform } from 'ionic-angular';
import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { OcrProvider } from '../../providers/ocr/ocr';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider } from '../../providers/product/product';
import { Camera } from '@ionic-native/camera';
import { ImagePersistence } from '../../providers/image-persistence/image-persistence';

enum CameraReadyStatus {
  ViewDataNotLoaded = "Can't take photo - data not loaded",
  NotOnDevice = "Can't take photo - not on device",
  Ready = "Ready"
}

@IonicPage({
  defaultHistory: ['ProductsPage'],
  segment: 'products/:id'
})
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private static cameraOptions = {
    quality: 100,
    destinationType: 1, //return a path to the image on the device
    sourceType: 1, //use the camera to grab the image
    encodingType: 0, //return the image in jpeg format
    cameraDirection: 1, //front facing camera
    saveToPhotoAlbum: true //save a copy to the users photo album as well
  };

  private isDataLoaded: boolean = false;
  private product: Product = Product.from({});

  constructor(private platform: Platform, private camera: Camera, private imagePersistence: ImagePersistence,
              private modalCtrl: ModalController, private navParams: NavParams, private ocrProvider: OcrProvider,
              private productProvider: ProductProvider, private allergensProvider: AllergensProvider, private alerter: GenericAlerter,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');

    const id = this.navParams.get('id');

    this
      .productProvider
      .getItem(id)
      .then(product => this.handleProductLoad(product))
      .catch(error => this.handleProductLoadError(error, id));
  }

  handleProductLoad(product: Product) {
    console.log(`loaded product ${product}`);
    this.product = product;
    this.isDataLoaded = true;
  }

  private handleProductLoadError(error: any, id: string) {
    const message = `Failed to load product ${id}`
    this.logAndPresentError(error, message.toLowerCase(), message);
  }

  private logAndPresentError(error: any, logMessage: string, displasyMessasge: string): void {
    console.error(logMessage, error);

    this.alerter.presentError(displasyMessasge);
    this.isDataLoaded = true;
  }

  presentEdit(): void {
    this
      .alerter
      .presentRename(this.product, () => this.save());
  }

  save() {
    this.productProvider.save(this.product);
  }

  viewText(picture: Picture): void {
    this
      .modalCtrl
      .create('PictureExtractedTextPage', { picture, product: this.product })
      .present();
  }

  removePicture(picture: Picture): void {
    this.product.removePicture(picture);
    this.save();
  }

  addPicture() {
    if (this.cantTakePhoto()) {
      this.alerter.presentError(this.cameraReadyStatus());
      return false;
    }

    this
      .camera
      .getPicture(ProductPage.cameraOptions)
      .then(imagePath => this.handleImageCapture(this.product, imagePath))
      .catch(error => this.handleImageCaptureError(error))
  }

  private cantTakePhoto(): boolean {
    return this.cameraReadyStatus() !== CameraReadyStatus.Ready;
  }

  private cameraReadyStatus(): CameraReadyStatus {
    if(!this.isDataLoaded) {
      return CameraReadyStatus.ViewDataNotLoaded;
    }

    if(!this.platform.is('cordova')){
      return CameraReadyStatus.NotOnDevice;
    }

    return CameraReadyStatus.Ready;
  }

  private handleImageCapture(product: Product, imagePath: string): void {
    console.log("captured image at path:", imagePath);

    this
      .imagePersistence
      .persist(imagePath)
      .then(persistentPath => this.handleImagePersistence(product, persistentPath))
      .catch(error => this.handleImagePersistenceError(error));
  }

  private handleImagePersistence(product: Product, path: string): void {
    console.log("image for", product, "persisted to path:", path);

    const picture = new Picture(path);
    product.addPicture(picture);

    this.save();
  }

  private handleImagePersistenceError(error: any): void {
    console.error("image persistence error:", error);

    this.alerter.presentError('Failed to persist image on device');
  }

  private handleImageCaptureError(error: any): void {
    console.error("error capturing image:", error);

    this.alerter.presentError('Failed to capture image');
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
