import { Injectable } from '@angular/core';
import { File, Entry } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

declare var cordova;

interface ImagePersistencer {
  persist(tempPath: string): Promise<string>
}

class IosImagePersistencer implements ImagePersistencer {
  constructor(private file: File) {}

  persist(tempPath: string): Promise<string> {
    let tempName = this.getFileName(tempPath);
    let persistentName = this.generatePersistentName();

    return this.file
      .moveFile(
        cordova.file.tempDirectory,
        tempName,
        cordova.file.dataDirectory,
        persistentName
      )
      .then((entry: Entry) => entry.name);
  }

  private getFileName(imagePath: string): string {
    return imagePath.replace(/^.*[\\\/]/, '');
  }

  private generatePersistentName(): string {
    let date = new Date();
    let time = date.getTime();

    return `${time}.jpg`;
  }
}

class AndroidImagePersistencer implements ImagePersistencer {
  persist(tempPath: string): Promise<string> {
    return Promise.resolve(tempPath);
  }
}

@Injectable()
export class ImagePersistence {
  constructor(private file: File, private platform: Platform) {
    console.log('Hello ImagePersistence Provider');
  }

  public persist(imagePath: any): Promise<string> {
    console.log("persisting image at path:", imagePath);

    let imagePersister = this.createPersister(this.file);

    return imagePersister.persist(imagePath);
  }

  private createPersister(file: File): ImagePersistencer {
    if (this.platform.is('ios')) {
      return new IosImagePersistencer(file);
    }

    return new AndroidImagePersistencer();;
  }

}
