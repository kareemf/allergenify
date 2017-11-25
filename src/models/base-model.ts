export class BaseModel {

    constructor(public name: string, public dateAdded: Date = new Date() ) {}

    static from(data: any): BaseModel {
      return new BaseModel(data.name, data.dateAdded);
    }
  }
