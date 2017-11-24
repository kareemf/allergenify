import { Component } from '@angular/core';
import { IonicPage, Platform, AlertController } from 'ionic-angular';
import { AllergensProvider } from '../../providers/allergens/allergens';
import { Allergen } from '../../models/allergen-model';

@IonicPage()
@Component({
  selector: 'page-allergens',
  templateUrl: 'allergens.html',
})
export class AllergensPage {
  private isDataLoaded: boolean = false;
  private allergens: Allergen[] = [];

  constructor(private platform: Platform, private allergensProvider: AllergensProvider,
              private alertController: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllergensPage');
    this.setupPlatformReady();
  }

  private setupPlatformReady(): void {
    this.platform.ready().then(() => {
      console.log('AllergensPage platform ready');
      this.loadAllergens();
    });
  }

  private loadAllergens(): void {
    this
      .allergensProvider
      .getAllergens()
      .then(allergens => this.handleAllergensLoad(allergens))
      .catch(error => this.handleAllergensLoadErorr(error));
  }

  private handleAllergensLoad(allergens: Allergen[]): void {
    console.log("loaded allergens", allergens);

    this.allergens = allergens;
    this.isDataLoaded = true;
  }

  private handleAllergensLoadErorr(error: any): void {
    console.error("allergens laod error:", error);
    this.isDataLoaded = true;
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
