import uuidv4 from 'uuid/v4';
import { BaseModel } from "./base-model";

export class Picture extends BaseModel {
  static from(data: any): Picture {
    return new Picture(data.name, data.id, data.dateAdded, data.text);
  }

  constructor(public name: string, public id: string = uuidv4(), public dateAdded: Date = new Date(),
              public text: string = '' ) {
    super(name, id, dateAdded);
  }

}
