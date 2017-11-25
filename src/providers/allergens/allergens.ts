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

  getAllergens(): Promise<Allergen[]> {
    return super.getItems();
  }

  protected handleDataLoaded(jsonText: string): Allergen[] {
    return super
      .handleDataLoaded(jsonText)
      .map(allergenObj =>
        new Allergen(allergenObj.name, new Date(allergenObj.dateAdded))
      );
  }

  save(allergens: Allergen[]): void {
    console.log('saving allergens', allergens);
    super.save(allergens);
  }

}
