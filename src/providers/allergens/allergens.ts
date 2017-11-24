import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Allergen } from '../../models/allergen-model';

@Injectable()
export class AllergensProvider {

  constructor(private storage: Storage) {
    console.log('Hello AllergensProvider');
  }

  getAllergens(): Promise<Allergen[]> {
    return this
      .storage
      .get('allergens')
      .then(jsonText => this.handleDataLoaded(jsonText));
    }

  private handleDataLoaded(jsonText: string): Allergen[] {
    if (!jsonText) {
      // TODO: remove test data
      return [
        new Allergen('peanut'),
        new Allergen('soy')
      ];
    }

    return JSON
      .parse(jsonText)
      .map(allergenObj =>
        new Allergen(allergenObj.name, new Date(allergenObj.dateAdded))
      );
  }

  save(allergens: Allergen[]): void {
    console.log('saving allergens', allergens);

    let json = JSON.stringify(allergens);
    this.storage.set('allergens', json);
  }

}
