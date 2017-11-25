import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class SaveDialogProvider {

  constructor(private alertController: AlertController) {
    console.log('Hello SaveDialogProvider');
  }

  present(title: string, onConfirm: (any) => void): void {
    this
      .alertController
      .create({
        title,
        message: '',
        inputs: [{ name: 'name'}],
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Save',
            handler: (inputs) => onConfirm(inputs.name)
          }
        ]
      })
      .present();
  }
}
