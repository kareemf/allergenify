import { Component } from '@angular/core';
import { IonicPage, Platform, AlertController } from 'ionic-angular';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';
import { ListPage } from '../list-page';

@IonicPage()
@Component({
  selector: 'page-allergens',
  templateUrl: 'allergens.html',
})
export class AllergensPage extends ListPage {
  private allergens: Allergen[] = [];

  constructor(platform: Platform, private allergensProvider: AllergensProvider,
              private alertController: AlertController) {
    super(platform, allergensProvider);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllergensPage');
    super.ionViewDidLoad();
  }

  protected postDataLoad(items: Allergen[]) {
    this.allergens = items;
  }

  add(): void {
    this
      .alertController
      .create({
        title: 'Add An Allergen',
        message: '',
        inputs: [{ name: 'name'}],
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Save',
            handler: (inputs) => this.handleAddAllergen(inputs.name)
          }
        ]
      })
      .present();
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
