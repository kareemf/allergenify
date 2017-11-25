import { BaseModel } from "./base-model";
import { Picture } from "./picture-model";

export class Product extends BaseModel {

  static from(data: any): Product {
    return new Product(data.name, data.dateAdded, data.pictures);
  }

  constructor(public name: string, public dateAdded: Date = new Date(), private pictures: Picture[] = [] ) {
    super(name, dateAdded);
  }

  addPicture(picture: Picture): void {
    this.pictures = [picture, ...this.pictures];
  }

  removePicture(picture: Picture): void {
    let index = this.pictures.indexOf(picture);

    this.pictures = [
      ...this.pictures.slice(0, index),
      ...this.pictures.slice(index + 1)
    ];
  }

}
