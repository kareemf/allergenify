import { Injectable } from '@angular/core';
import { Picture } from '../../models/picture-model';

@Injectable()
export class OcrProvider {

  constructor() {
    console.log('Hello OcrProvider Provider');
  }

  extractText(picture: Picture): Promise<string> {
    //TODO: connect to Google Vision
    return Promise.resolve("soy peanut flowers");
  }
}
