import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { IonicModule, IonicPage, ModalController  } from 'ionic-angular';
import { Platform  } from 'ionic-angular';
import { PlatformMock } from '../../../test-config/mocks-ionic';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraMock } from '@ionic-native-mocks/camera';
import { NavParams } from 'ionic-angular';
import { NavParamsMock } from '../../../test-config/nav-params-mock';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Storage } from '@ionic/storage';
import { StorageMock } from '../../../test-config/storage-mock';

import { Product } from '../../models/product-model';
import { Picture } from '../../models/picture-model';
import { Allergen } from '../../models/allergen-model';

import { OcrProvider, TextExtracter } from '../../providers/ocr/ocr';
import { AllergensProvider, AllergenFetcher, AllergensChecker } from '../../providers/allergens/allergens-provider';
import { GenericAlerter, Alerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider, ProductFetcher, ProductSaver } from '../../providers/product/product';
import { ProductsProvider } from '../../providers/products/products';
import { ProductsProviderMock } from '../../../test-config/products-provider-mock';
import { PipesModule } from '../../pipes/pipes.module';
import { ProductPage } from './product';
import { By } from '@angular/platform-browser';
import { GenericAlerterMock } from '../../../test-config/generic-alerter-mock';

class OcrProviderMock implements TextExtracter {
  extractText(picture: Picture): Promise<string> {
    return Promise.resolve(`Daily Hydrating Vitamin E & Avocado Protects and defends skin from
    dryness for healthy looking skin. This creamy, non-greasy formula containing Vitamin E and Avocado provides
    immediate moisturization, softening dry skin. Apply daily to achieve the soft, smooth, he Cthy look and feel
    that your skin d. 'N OUR PHILOSOPHY St. Ives is dedicated. Sy you the best of nature with Laulas that
    delight the senses as they leave your skin with a radiant, soft and fresh feel. a suitable for Sensitive
    Skin a Dermatologist Tested. Paraben Free Does Not Contain Animal Ingredients Made with 100% Natural
    Moisturizers (Vegetable Glycerin, Soy Bean Oil) Learn about our products at Stives.com Directions: Massage
    gently into clean, dry skin. Apply daily. Continued use improves skin moisturization. WARNING: USE ONLY AS
    DIRECTED. AVOID CONTACT WITH EYES. IF EYE CONTACT OCCURS IMMEDIATELY RINSE WITH WATER. IF RASH OR IRRITATION
    OCCURS, DISCONTINUE USE. INGREDIENTS: WATER (AQUA), GLYCERIN, STEARIC ACID, GLYCINE SI SOYBEAN) OIL, GLYCOL
    STEARATE, DIMETHICONE, GLYCERYL STEARATE TRIETHANOLAMÍNE, CETYL ALCOHOL, CAPRYLYL GLYCOL, PHENOX FRAGRANCE
    (PARFUM), CARBOMER, HYDROXYETHYLCELLULOSE, EDIA, BHT, STEARAMIDE AMP, TOCOPHERYL ACETATE, PERSEA GRATISSI.
    (AVOCADO) OIL. ZMES BY Unilever 08031|| QINII Furn
    Sunflower`);
  }
}

class AllergensProviderMock implements AllergenFetcher, AllergensChecker {
  static allergens: Allergen[] = [
    // strings from extracted text
    Allergen.from({ name: 'Sunflower' }),
    Allergen.from({ name: 'Fragrance' }),
    Allergen.from({ name: 'Parfum' }),
  ];

  getItems(): Promise<Allergen[]> {
    return Promise.resolve(AllergensProviderMock.allergens);
  }

  checkForAllergens(text: string): Promise<Allergen[]> {
    // TODO: determine what, if anything, should match
    return Promise.resolve(AllergensProviderMock.allergens);
  }
}

class ProductProviderMock implements ProductFetcher, ProductSaver {
  public static product: Product = null;

  getItem(id: string): Promise<Product> {
    console.log('MOCK PRODUCT GET', ProductProviderMock.product);

    return Promise.resolve(ProductProviderMock.product);
  }

  save(product: Product) {
    console.log('MOCK PRODUCT SAVE', product);

    ProductProviderMock.product = product;
  }
}

describe('ProductPage', () => {
  const ALERT_MESSAGE_SELECTOR = '.alert-message';

  let fixture: ComponentFixture<ProductPage>;
  let component: ProductPage;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  let picture: Picture;
  let product: Product;

  beforeEach(async(() => {
    picture = Picture.from({ name: 'dummy pic' });
    product = Product.from({ name: 'dummy product' });

    product.addPicture(picture)

    ProductProviderMock.product = product;

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
        { provide: NavParams, useClass: NavParamsMock },
        // TODO: not a valid use
        { provide: Storage, useClass: StorageMock },
        { provide: OcrProvider, useClass: OcrProviderMock },
        { provide: AllergensProvider, useClass: AllergensProviderMock },
        { provide: GenericAlerter, useClass: GenericAlerterMock },
        { provide: ProductProvider, useClass: ProductProviderMock },
        { provide: ProductsProvider, useClass: ProductsProviderMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof ProductPage).toBe(true);
  });

  it('should identify all allergens in text extracted from scanned images', fakeAsync(() => {
    component.ionViewDidLoad();
    updateState();

    component.scanPicture(picture);
    fixture.detectChanges();

    updateState();

    product = ProductProviderMock.product;
    expect(product.numAllergens()).toBe(3);
  }));

  it('should track whether or not an image is being scanned', fakeAsync(() => {
    expect(component.isScanning(picture)).toBeFalsy();

    component.scanPicture(picture);
    fixture.detectChanges();

    expect(component.isScanning(picture)).toBeTruthy();

    updateState();

    expect(component.isScanning(picture)).toBeFalsy();;
  }));

  it('should be able to remove picture', fakeAsync(() => {
    component.removePicture(picture);
    fixture.detectChanges();
    updateState();

    product = ProductProviderMock.product;
    expect(product.numPictures()).toBe(0);
  }));

  function updateState() {
    tick();
    fixture.detectChanges();
  }
});
