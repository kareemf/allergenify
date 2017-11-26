import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { BaseModel } from '../../models/base-model';

@Injectable()
export class GenericAlerter {

  constructor(private alertController: AlertController) {
    console.log('Hello GenericAlerter');
  }

  presentRename<T extends BaseModel>(entity: T, onRename: (entity: T, newName: string) => void): void {
    this
      .alertController
      .create({
        title: 'Rename',
        message: 'Enter the new name',
        inputs: [{
          name: 'name',
          value: entity.name
        }],
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Save',
            handler: data => {
              const { name } = data;
              entity.name = name;

              onRename(entity, name);
            }
          }
        ]
    })
    .present();
  }

  presentConfirmation(message: string) {
    this.present('Confirm', message);
  }

  presentError(message: string) {
    this.present('Woops', message);
  }

  present(title: string = '', message: string = '', buttons = [{ text: 'Ok' }]) {
    this
      .alertController
      .create({
        title,
        message,
        buttons
    })
    .present();
  }
}
