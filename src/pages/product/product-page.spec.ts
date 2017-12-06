import { async, TestBed } from '@angular/core/testing';

import { IonicModule, IonicPage, ModalController  } from 'ionic-angular';
import { Platform  } from 'ionic-angular';
import { PlatformMock } from '../../../test-config/mocks-ionic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraMock } from '@ionic-native-mocks/camera';
import { File } from '@ionic-native/file';
import { FileMock } from '@ionic-native-mocks/file';
import { NavParams } from 'ionic-angular';
import { NavParamsMock } from '../../../test-config/nav-params-mock';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';
import { StorageMock } from '../../../test-config/stoage-mock';

import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { Allergen } from '../../models/allergen-model';

import { OcrProvider } from '../../providers/ocr/ocr';
import { AllergensProvider } from '../../providers/allergens/allergens-provider';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider } from '../../providers/product/product';
import { ProductsProvider } from '../../providers/products/products';
import { ImagePersistence } from '../../providers/image-persistence/image-persistence';
import { PipesModule } from '../../pipes/pipes.module';
import { ProductPage } from './product';


describe('ProductPage', () => {
  let fixture;
  let component;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPage],
      imports: [
        IonicModule.forRoot(ProductPage),
        PipesModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: Camera, useClass: CameraMock },
        { provide: File, useClass: FileMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: Storage, useClass: StorageMock },
        AllergensProvider,
        ImagePersistence,
        OcrProvider,
        GenericAlerter,
        ProductProvider,
        ProductsProvider,
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof ProductPage).toBe(true);
  });
});
