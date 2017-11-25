import { Storage } from '@ionic/storage';
import { BaseModel } from '../models/base-model';

export class StorageDataProvider {

  constructor(private storage: Storage, private itemsKey: string) {
    console.log('Hello StorageDataProvider');
  }

  public getItems() {
    return this
      .storage
      .get(this.itemsKey)
      .then(jsonText => this.handleDataLoaded(jsonText, (data) => BaseModel.from(data)));
  }

  protected handleDataLoaded(jsonText: string, mapper: (any) => BaseModel): any[] {
    if (!jsonText) {
      return [];
    }

    return JSON
      .parse(jsonText)
      .map(data => mapper(data));
  }

  public save(items: BaseModel[]): void {
    console.log(`saving ${this.itemsKey}`, items);
    let json = JSON.stringify(items);
    this.storage.set(this.itemsKey, json);
  }
}
