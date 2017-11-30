import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Picture } from '../../models/picture-model';
import { VISION_API_KEY  } from './access-config';

// https://cloud.google.com/vision/docs/request
interface VisionRequestBody {
  requests: AnnotateImageRequest[]
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#AnnotateImageRequest
interface AnnotateImageRequest {
  image: VisionImage,
  features: VisionFeature[],
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Image
interface VisionImage {
  content: string,
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Feature
interface VisionFeature {
  type: VisionFeatureType,
  maxResults: number
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#Type
enum VisionFeatureType {
  DOCUMENT_TEXT_DETECTION = "DOCUMENT_TEXT_DETECTION"
}

interface VisionResponse {
  responses: AnnotateImageResponse[]
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#AnnotateImageResponse
interface AnnotateImageResponse {
  fullTextAnnotation: TextAnnotation
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#TextAnnotation
interface TextAnnotation {
  text: string
}

@Injectable()
export class OcrProvider {
  private static BASE_VISION_API_URL= "https://vision.googleapis.com/v1/images:annotate?key=";

  constructor(private httpClient: HttpClient) {
    this.removeBase64Metadata = this.removeBase64Metadata.bind(this);
    this.getDocumentTextRequestBody = this.getDocumentTextRequestBody.bind(this);
    this.makeVisionRequest = this.makeVisionRequest.bind(this);
    this.handleVisionResponse = this.handleVisionResponse.bind(this);
  }

  extractText(picture: Picture): Promise<string> {
    return this
      .toBase64(picture)
      .then(this.removeBase64Metadata)
      .then(this.getDocumentTextRequestBody)
      .then(this.makeVisionRequest);

  }

  private toBase64(picture: Picture): Promise<string> {
    return new Promise((resolve) => {
      this.toDataURL(picture.name, dataUrl => resolve(dataUrl));
    });
  }

  // TODO: parse output format from image extension
  // TODO: clean
  // Thanks, S.O.: https://stackoverflow.com/a/20285053/1377016
  private toDataURL(src, callback, format = 'jpeg'): void {
    const prefixedFormat = `image/${format}`;
    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function() {
      var thing = this as HTMLImageElement;
      var canvas = document.createElement('CANVAS') as HTMLCanvasElement;
      var ctx = canvas.getContext('2d');
      var dataURL;

      canvas.height = thing.naturalHeight;
      canvas.width = thing.naturalWidth;

      ctx.drawImage(thing, 0, 0);
      dataURL = canvas.toDataURL(prefixedFormat);
      callback(dataURL);
    };

    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = `data:image/${format};base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==`;
      img.src = src;
    }
  }

  // Removes the 'data:image/jpeg;base64,' part
  private removeBase64Metadata(base64: string): string {
    return base64.replace(/^data:image\/.+;base64,/,"");
  }

  private getDocumentTextRequestBody(base64: string): VisionRequestBody {
    return {
      requests: [{
        image: {
          content: base64
        },
        features: [{
          type: VisionFeatureType.DOCUMENT_TEXT_DETECTION,
          maxResults: 1
        }]
      }]
    }
  }

  private makeVisionRequest(requestBody): Promise<string> {
    const url = this.visionApiUrl();

    return this
      .httpClient
      .post(url, requestBody)
      .toPromise()
      .then(this.handleVisionResponse);
  }

  private visionApiUrl(): string {
    return `${OcrProvider.BASE_VISION_API_URL}${VISION_API_KEY}`;
  }

  private handleVisionResponse(response: VisionResponse): string {
    const { responses: [ firstResponse ] } = response;

    return firstResponse.fullTextAnnotation.text;
  }
}


