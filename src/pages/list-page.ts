import { StorageDataProvider } from "../providers/storage-data";
import { Platform } from "ionic-angular";
import { BaseModel } from "../models/base-model";

export abstract class ListPage {
  private isListDataLoaded: boolean = false;

  constructor (private platform: Platform, private dataProvider: StorageDataProvider) {}

  ionViewDidLoad() {
    this.setupPlatformReady();
  }

  private setupPlatformReady(): void {
    this.platform.ready().then(() => {
      console.log('platform ready');
      this.loadItems();
    });
  }

  private loadItems(): void {
    this
      .dataProvider
      .getItems()
      .then(items => this.handleItemsLoad(items))
      .catch(error => this.handleItemsLoadErorr(error));
  }

  private handleItemsLoad(items: BaseModel[]): void {
    console.log("loaded items", items);

    this.isListDataLoaded = true;
    this.postDataLoad(items);
  }

  abstract postDataLoad(items: BaseModel[]);

  private handleItemsLoadErorr(error: any): void {
    console.error("load error:", error);
    this.isListDataLoaded = true;
  }
}
