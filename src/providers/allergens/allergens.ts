import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Allergen } from '../../models/allergen-model';
import { StorageDataProvider } from '../storage-data';

@Injectable()
export class AllergensProvider extends StorageDataProvider {

  constructor(storage: Storage) {
    super(storage, 'allergens');
    console.log('Hello AllergensProvider');
  }

  getItems(): Promise<Allergen[]> {
    return super._getItems<Allergen>(Allergen.from);
  }

  checkForAllergens(text: string): Promise<Allergen[]> {
    return this
      .getItems()
      .then((allergens: Allergen[]) => this.handleAllergensCheck(text, allergens));
  }

  private handleAllergensCheck(text: string, allergens: Allergen[]): Allergen[] {
    const tokens = text.split(' ');

    // TODO: new AllergenMatch concept that includes allergen and matching word
    return allergens.reduce((allTriggeredAllergens, allergen) => {
      const triggeredAllergens = tokens.filter(token => token.includes(allergen.name));

      return [...allTriggeredAllergens, ...triggeredAllergens];
    }, []);
  }
}
