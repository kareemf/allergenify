import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { IonicModule, NavController, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { StorageMock } from '../../../test-config/storage-mock';

import { ProductsPage } from './products';
import { PipesModule } from '../../pipes/pipes.module';
import { ProductsProvider } from '../../providers/products/products';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../models/product-model';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';
import { PlatformMock } from '../../../test-config/mocks-ionic';

import { NavControllerMock } from '../../../test-config/nav-controller-mock';
import { GenericAlerterMock } from '../../../test-config/generic-alerter-mock';
import { ProductsProviderMock } from '../../../test-config/product-provider-mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ProductsPage', () => {
  let fixture: ComponentFixture<ProductsPage>;
  let component: ProductsPage;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsPage],
      imports: [
        IonicModule.forRoot(ProductsPage),
        PipesModule,
      ],
      providers: [
        { provide: Storage, useClass: StorageMock },
        { provide: ProductsProvider, useClass: ProductsProviderMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: GenericAlerter, useClass: GenericAlerterMock },
        { provide: NavController, useClass: NavControllerMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof ProductsPage).toBe(true);
  });

  it('should load items when platform is ready', fakeAsync(() => {
    givenALoadedView();
    whenListElementIsGrabbed();
    thenCountIs(0);
  }));

  function givenALoadedView() {
    component.ionViewDidLoad();
    updateState();
  }

  function whenListElementIsGrabbed() {
    debugElement = fixture.debugElement.query(By.css('.list'));
    nativeElement = debugElement.nativeElement;
  }

  function thenCountIs(expectedCount: number) {
    expect(nativeElement.children.length).toBe(expectedCount);
  }

  function updateState() {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }
});
