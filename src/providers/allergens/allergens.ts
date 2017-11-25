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

}
