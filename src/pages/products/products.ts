import { Component } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ProductsProvider } from '../../providers/products/products';
import { Product } from '../../models/product-model';
import { ListPage } from '../list-page';
import { ImagePersistence } from
'../../providers/image-persistence/image-persistence';
import { Picture } from '../../models/picture-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';

enum CameraReadyStatus {
  ViewDataNotLoaded = "Can't take photo - data not loaded",
  NotOnDevice = "Can't take photo - not on device",
  Ready = "Ready"
}

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage extends ListPage<Product> {
  private static cameraOptions = {
    quality: 100,
    destinationType: 1, //return a path to the image on the device
    sourceType: 1, //use the camera to grab the image
    encodingType: 0, //return the image in jpeg format
    cameraDirection: 1, //front facing camera
    saveToPhotoAlbum: true //save a copy to the users photo album as well
  };

  constructor(protected platform: Platform, productsProvider: ProductsProvider,
              protected alerter: GenericAlerter,private navController: NavController,
              private camera: Camera, private imagePersistence: ImagePersistence) {
    super('Product', platform, productsProvider, alerter);
  }

  protected createItem(name): Product {
    return new Product(name);
  }

  view(product: Product): void {
    this.navController.push('ProductPage', {
      slug: product.slug,
      onPicture: () => this.addPhotoTo(product)
    });
  }

  addPhotoTo(product: Product) {
    if (this.cantTakePhoto()) {
      this.alerter.presentError(this.cameraReadyStatus());
      return false;
    }

    this
      .camera
      .getPicture(ProductsPage.cameraOptions)
      .then(imagePath => this.handleImageCapture(product, imagePath))
      .catch(error => this.handleImageCaptureError(error))
  }

  private cantTakePhoto(): boolean {
    return this.cameraReadyStatus() !== CameraReadyStatus.Ready;
  }

  private cameraReadyStatus(): CameraReadyStatus {
    if(!this.isListDataLoaded) {
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
}
