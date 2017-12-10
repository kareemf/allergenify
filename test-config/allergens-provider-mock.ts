import { Allergen } from '../src/models/allergen-model';
import { AllergensSaver, AllergensFetcher } from '../src/providers/allergens/allergens-provider';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export class AllergensProviderMock implements AllergensFetcher, AllergensSaver {
  private items: Allergen[];

  setItems(items: Allergen[]) {
    this.items = items;
  }

  getItems(): Promise<Allergen[]> {
    return Promise.resolve(this.items);
  }

  save(items): Promise<any> {
    return Promise.resolve(this.items);
  }

  checkForAllergens(text: string): Promise<Allergen[]> {
    return Promise.resolve(this.items);
  }
}
