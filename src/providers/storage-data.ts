import { Storage } from '@ionic/storage';
import { BaseModel } from '../models/base-model';

export class StorageDataProvider {

  constructor(private storage: Storage, private itemsKey: string) {
    console.log('Hello StorageDataProvider');
  }

  protected getItems() {
    return this
      .storage
      .get(this.itemsKey)
      .then(jsonText => this.handleDataLoaded(jsonText));
  }

  protected handleDataLoaded(jsonText: string): any[] {
    if (!jsonText) {
      return [];
    }

    return JSON.parse(jsonText)
  }

  protected save(items: BaseModel[]): void {
    let json = JSON.stringify(items);
    this.storage.set(this.itemsKey, json);
  }
}
