import uuidv4 from 'uuid/v4';
import { BaseModel } from "./base-model";

export class Allergen extends BaseModel {

  static from(data: any): Allergen {
    return new Allergen(data.name, data.id, data.dateAdded);
  }

  constructor(public name: string, public id: string = uuidv4(), public dateAdded: Date = new Date() ) {
    super(name, id, dateAdded);
  }

}
