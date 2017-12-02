import { Injectable } from '@angular/core';
import { File, Entry } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { CameraOptions, Camera, DestinationType } from '@ionic-native/camera';

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
      .then((entry: Entry) => {
        console.log("persisted iOS file to", entry.nativeURL);
        return entry.nativeURL;
      });
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
    console.log("persisted Android file to", tempPath);
    return Promise.resolve(tempPath);
  }
}

class Base64ImagePersistencer implements ImagePersistencer {
  persist(base64: string): Promise<string> {
    console.log("persisted base64 to", base64);
    return Promise.resolve(base64);
  }
}

@Injectable()
export class ImagePersistence {
  constructor(private file: File, private platform: Platform) {
    console.log('Hello ImagePersistence Provider');
  }

  public persist(imagePath: any, cameraOptions: CameraOptions): Promise<string> {
    console.log("persisting image at path:", imagePath);

    let imagePersister = this.createPersister(cameraOptions);

    return imagePersister.persist(imagePath);
  }

  private createPersister(cameraOptions: CameraOptions): ImagePersistencer {
    if (cameraOptions.destinationType == DestinationType.DATA_URL) {
      return new Base64ImagePersistencer();
    }

    if (this.platform.is('ios')) {
      return new IosImagePersistencer(this.file);
    }

    return new AndroidImagePersistencer();;
  }

}
