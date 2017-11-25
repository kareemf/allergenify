import { BaseModel } from "./base-model";
import { Picture } from "./picture-model";

export class Product extends BaseModel {

    constructor(public name: string, public dateAdded: Date = new Date(), private photos: Picture[] = [] ) {
      super(name, dateAdded);
    }

  }
