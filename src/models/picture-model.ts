import { BaseModel } from "./base-model";

export class Picture extends BaseModel {

  constructor(public name: string, public dateAdded: Date = new Date() ) {
    super(name, dateAdded);
  }

}
