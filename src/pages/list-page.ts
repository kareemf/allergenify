import { StorageDataProvider } from "../providers/storage-data";
import { Platform } from "ionic-angular";

export abstract class ListPage {
  protected isListDataLoaded: boolean = false;

  constructor (protected platform: Platform, private dataProvider: StorageDataProvider) {}

  ionViewDidLoad() {
    this.setupPlatformReady();
  }

  private setupPlatformReady(): void {
    this.platform.ready().then(() => {
      console.log('platform ready');
      this.loadItems();
    });
  }

  private loadItems<T>(): void {
    this
      .dataProvider
      .getItems()
      .then((items: T[]) => this.handleItemsLoad(items))
      .catch(error => this.handleItemsLoadErorr(error));
  }

  private handleItemsLoad<T>(items: T[]): void {
    console.log("loaded items", items);

    this.isListDataLoaded = true;
    this.postDataLoad(items);
  }

  protected abstract postDataLoad<T>(items: T[]);

  private handleItemsLoadErorr(error: any): void {
    console.error("load error:", error);
    this.isListDataLoaded = true;
  }
}
