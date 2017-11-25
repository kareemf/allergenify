import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';
import { ListPage } from '../list-page';
import { SaveDialogProvider } from '../../providers/save-dialog/save-dialog';

@IonicPage()
@Component({
  selector: 'page-allergens',
  templateUrl: 'allergens.html',
})
export class AllergensPage extends ListPage {
  private allergens: Allergen[] = [];

  constructor(platform: Platform, private allergensProvider: AllergensProvider,
              private saveDialogProvider: SaveDialogProvider) {
    super(platform, allergensProvider);
    this.handleAddAllergen = this.handleAddAllergen.bind(this);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllergensPage');
    super.ionViewDidLoad<Allergen>();
  }

  protected postDataLoad<Allergen>(items) {
    this.allergens = items;
  }

  add(): void {
    this.saveDialogProvider.present('Add An Allergen', this.handleAddAllergen);
  }

  private handleAddAllergen(name: string): void {
    const allergen = new Allergen(name);

    this.allergens.push(allergen);
    this.save();
  }

  remove(allergen: Allergen): void {
    this
      .allergensProvider
      .remove(allergen, this.allergens)
      .then((allergens: Allergen[]) => this.allergens = allergens);
  }

  save() {
    this.allergensProvider.save(this.allergens);
  }
}
