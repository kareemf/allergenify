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

import { OcrProvider, TextExtracter } from '../../providers/ocr/ocr';
import { AllergensProvider, AllergenFetcher, AllergensChecker } from '../../providers/allergens/allergens-provider';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { ProductProvider } from '../../providers/product/product';
import { ProductsProvider } from '../../providers/products/products';
import { ImagePersistence } from '../../providers/image-persistence/image-persistence';
import { PipesModule } from '../../pipes/pipes.module';
import { ProductPage } from './product';

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
    return Promise.resolve([])
  }
}

describe('ProductPage', () => {
  let fixture;
  let component: ProductPage;

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
        { provide: OcrProvider, useClass: OcrProviderMock },
        { provide: AllergensProvider, useClass: AllergensProviderMock },
        ImagePersistence,
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

  it('should identify allergens in scanned images', () => {
    const picutre = Picture.from({ name: 'dummy' });
    component.scanPicture(picutre);

    expect(component instanceof ProductPage).toBe(true);
  });
});
