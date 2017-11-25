import { BaseModel } from "./base-model";

export class Product extends BaseModel {

    constructor(public name: string, public dateAdded: Date = new Date() ) {
      super(name, dateAdded);
    }

  }
