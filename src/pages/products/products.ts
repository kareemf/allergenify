// TODO: dedupe this code further
import { Component } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ProductsProvider } from '../../providers/products/products';
import { Product } from '../../models/product-model';
import { ListPage } from '../list-page';
import { SaveDialogProvider } from '../../providers/save-dialog/save-dialog';
import { ImagePersistence } from
'../../providers/image-persistence/image-persistence';
import { Picture } from '../../models/picture-model';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage extends ListPage {
  private static cameraOptions = {
    quality: 100,
    destinationType: 1, //return a path to the image on the device
    sourceType: 1, //use the camera to grab the image
    encodingType: 0, //return the image in jpeg format
    cameraDirection: 1, //front facing camera
    saveToPhotoAlbum: true //save a copy to the users photo album as well
  };

  private products: Product[] = [];

  constructor(protected platform: Platform, private productsProvider: ProductsProvider,
              private saveDialogProvider: SaveDialogProvider, private camera: Camera,
              private imagePersistence: ImagePersistence, private alertController: AlertController,
              private navController: NavController) {
    super(platform, productsProvider);
    this.handleAddProduct = this.handleAddProduct.bind(this);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    super.ionViewDidLoad();
  }

  protected postDataLoad<Product>(items) {
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

  save() {
    this.productsProvider.save(this.products);
  }

  remove(product: Product): void {
    this
      .productsProvider
      .remove(product, this.products)
      .then((products: Product[]) => this.products = products);
  }

  view(product: Product): void {
    this.navController.push('ProductPage', { product });
  }

  addPhotoTo(product: Product) {
    if (this.cantTakePhoto()) {
      return false;
    }

    this
      .camera
      .getPicture(ProductsPage.cameraOptions)
      .then(imagePath => this.handleImageCapture(product, imagePath))
      .catch(error => this.handleImageCaptureError(error))
  }

  private cantTakePhoto(): boolean {
    // TODO: reenable after device debugging works
    // if(!this.isListDataLoaded) {
    //   console.log("can't take photo - data not loaded")
    //   return true;
    // }

    if(!this.platform.is('cordova')){
      console.log("can't take photo - not on device");
      return true;
    }

    return false;
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

    this.presentError('Failed to persist image on device');
  }

  private handleImageCaptureError(error: any): void {
    console.error("error capturing image:", error);

    this.presentError('Failed to capture image');
  }

  private presentError(message: string = ''){
    this
      .alertController
      .create({
      title: 'Woops',
      message,
      buttons: [{
        text: 'Ok'
      }]
    });
  }
}
