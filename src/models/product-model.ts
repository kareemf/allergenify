import { BaseModel } from "./base-model";
import { Picture } from "./picture-model";
import { Allergen } from "./allergen-model";

enum Status {
  NotScanned = "Not Scanned",
  NothingFound = "Nothing Found",
  SomethingFound = "Something Found"
}

export class Product extends BaseModel {

  static from(data: any): Product {
    const pictures = data.pictures.map(Picture.from);
    const allergens = data.allergens.map(Allergen.from);

    return new Product(data.name, data.dateAdded, data.dateScanned, pictures, allergens);
  }

  constructor(public name: string, public dateAdded: Date = new Date(), public dateScanned: Date = null,
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

  numAllergens(): number {
    return this.allergens.length;
  }

  containsAllergens(): boolean {
    return this.numAllergens() > 0;
  }

  numPictures(): number {
    return this.pictures.length;
  }

  get status() {
    if (!this.dateScanned) {
      return Status.NotScanned
    }

    if (this.containsAllergens()) {
      return Status.SomethingFound
    }

    return Status.NothingFound
  }
}
