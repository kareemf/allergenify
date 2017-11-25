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
    super.ionViewDidLoad();
  }

  protected postDataLoad(items: Allergen[]) {
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
    console.log('removing', allergen);

    const index = this.allergens.indexOf(allergen);

    if(index < 0) {
      console.error('unable to find/delete', allergen);
      return;
    }

    this.removeAt(index);
    console.log('done removing', allergen);
  }

  private removeAt(index: number): void {
    this.allergens = [
      ...this.allergens.slice(0, index),
      ...this.allergens.slice(index + 1)
    ];

    this.save();
  }

  private save() {
    this.allergensProvider.save(this.allergens);
  }
}
