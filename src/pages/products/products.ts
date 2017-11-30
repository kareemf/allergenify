import { Component } from '@angular/core';
import { IonicPage, Platform, NavController } from 'ionic-angular';
import { ProductsProvider } from '../../providers/products/products';
import { Product } from '../../models/product-model';
import { ListPage } from '../list-page';
'../../providers/image-persistence/image-persistence';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage extends ListPage<Product> {
  constructor(protected platform: Platform, productsProvider: ProductsProvider,
              protected alerter: GenericAlerter,private navController: NavController) {
    super('Product', platform, productsProvider, alerter);
  }

  protected createItem(name): Product {
    return new Product(name);
  }

  view(product: Product): void {
    this.navController.push('ProductPage', {
      id: product.id,
    });
  }
}
