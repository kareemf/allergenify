import { BaseModel } from "./base-model";
import { Picture } from "./picture-model";
import { Allergen } from "./allergen-model";

export class Product extends BaseModel {

  static from(data: any): Product {
    const pictures = data.pictures.map(Picture.from);
    return new Product(data.name, data.dateAdded, pictures);
  }

  constructor(public name: string, public dateAdded: Date = new Date(),
              public pictures: Picture[] = [], public allergens: Allergen[] = []) {
    super(name, dateAdded);

    // TODO: remove test data
    this.addPicture(new Picture("/img.png"));
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
