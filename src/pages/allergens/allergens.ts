import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
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

  constructor(private platform: Platform, private allergensProvider: AllergensProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllergensPage');
    this.setupPlatformReady();
  }

  private setupPlatformReady() {
    this.platform.ready().then(() => {
      console.log('AllergensPage platform ready');
      this.loadAllergens();
    });
  }

  private loadAllergens(): any {
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

  private removeAt(index: number) {
    this.allergens = [
      ...this.allergens.slice(0, index),
      ...this.allergens.slice(index + 1)
    ];

    this.allergensProvider.save(this.allergens);
  }
}
