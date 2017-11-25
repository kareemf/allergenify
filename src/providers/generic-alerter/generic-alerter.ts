import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class GenericAlerterProvider {

  constructor(private alertController: AlertController) {
    console.log('Hello GenericAlerterProvider');
  }

  presentConfirmation(message: string) {
    this.present('Confirm', message);
  }

  presentError(message: string) {
    this.present('Woops', message);
  }

  present(title: string = '', message: string = '') {
    this
      .alertController
      .create({
        title,
        message,
        buttons: [{
          text: 'Ok'
      }]
    })
    .present();
  }
}
