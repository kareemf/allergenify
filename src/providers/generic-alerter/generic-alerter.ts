import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class GenericAlerterProvider {

  constructor(private alertController: AlertController) {
    console.log('Hello GenericAlerterProvider');
  }

  presentError(message: string = '') {
    this
      .alertController
      .create({
      title: 'Woops',
      message,
      buttons: [{
        text: 'Ok'
      }]
    });
  }
}
