import { Storage } from '@ionic/storage';
import { BaseModel } from '../models/base-model';

export class StorageDataProvider {

  constructor(private storage: Storage, private itemsKey: string) {
    console.log('Hello StorageDataProvider');
  }

  public getItems(): Promise<BaseModel[]> {
    console.log(`fetching ${this.itemsKey}`);

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

  public remove(item: BaseModel, items: BaseModel[]): Promise<BaseModel[]> {
    console.log(`removing  ${this.itemsKey}`, item, 'from', items);

    const index = items.indexOf(item);

    if(index < 0) {
      console.error('unable to find/delete', item);
      return Promise.reject(new Error());;
    }

    const newItems = this.removeFrom(items, index);
    this.save(newItems);

    console.log('done removing item', item);
    return Promise.resolve(newItems);
  }

  protected removeFrom(items: BaseModel[], index: number): BaseModel[] {
    return [
      ...items.slice(0, index),
      ...items.slice(index + 1)
    ];
  }
}
