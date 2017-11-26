import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';
import { ListPage } from '../list-page';
import { SaveDialogProvider } from '../../providers/save-dialog/save-dialog';
import { GenericAlerter } from '../../providers/generic-alerter/generic-alerter';

@IonicPage()
@Component({
  selector: 'page-allergens',
  templateUrl: 'allergens.html',
})
export class AllergensPage extends ListPage<Allergen> {
  constructor(protected platform: Platform, allergensProvider: AllergensProvider,
              protected alerter: GenericAlerter, saveDialogProvider: SaveDialogProvider) {
    super('Allergen', platform, allergensProvider, alerter, saveDialogProvider);
  }

  protected createItem(name): Allergen {
    return new Allergen(name);
  }
}
