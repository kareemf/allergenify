import { BaseModel } from "./base-model";

export class Allergen extends BaseModel {

  constructor(public name: string, public dateAdded: Date = new Date() ) {
    super(name, dateAdded);
  }

  static from(data: any): Allergen {
    return new Allergen(data.name, data.dateAdded);
  }

}
