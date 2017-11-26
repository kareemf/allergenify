import { BaseModel } from "./base-model";

export class Picture extends BaseModel {
  static from(data: any): Picture {
    return new Picture(data.name, data.dateAdded, data.text);
  }

  constructor(public name: string, public dateAdded: Date = new Date(),
              public text: string = '' ) {
    super(name, dateAdded);
  }

}
