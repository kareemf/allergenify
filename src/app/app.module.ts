import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { AllergensProvider } from '../providers/allergens/allergens';
import { ProductsProvider } from '../providers/products/products';
import { SaveDialogProvider } from '../providers/save-dialog/save-dialog';
import { ImagePersistence } from '../providers/image-persistence/image-persistence';
import { OcrProvider } from '../providers/ocr/ocr';
import { GenericAlerterProvider } from '../providers/generic-alerter/generic-alerter';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    AllergensProvider,
    ProductsProvider,
    SaveDialogProvider,
    ImagePersistence,
    OcrProvider,
    GenericAlerterProvider
  ]
})
export class AppModule {}
