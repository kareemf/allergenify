import { BaseModel } from "./base-model";
import { Picture } from "./picture-model";

export class Product extends BaseModel {

    constructor(public name: string, public dateAdded: Date = new Date(), private pictures: Picture[] = [] ) {
      super(name, dateAdded);
    }

    addPicture(picture: Picture): void {
      this.pictures = [picture, ...this.pictures];
    }
  }
