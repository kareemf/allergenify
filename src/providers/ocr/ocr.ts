import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Picture } from '../../models/picture-model';
import { VISION_API_KEY  } from './access-config';

// https://cloud.google.com/vision/docs/request
interface VisionRequest {
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
  DOCUMENT_TEXT_DETECTION
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#AnnotateImageResponse
interface AnnotateImageResponse {
  // textAnnotations: EntityAnnotation[]
  fullTextAnnotation: TextAnnotation
}

// https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate#TextAnnotation
interface TextAnnotation {
  text: string
}

const BASE_VISION_API_URL= "https://vision.googleapis.com/v1/images:annotate?key=";

function visionApiUrl(): string {
  return `${BASE_VISION_API_URL}${VISION_API_KEY}`;
}

@Injectable()
export class OcrProvider {

  constructor(private httpClient: HttpClient) {
    console.log('Hello OcrProvider Provider');
  }

  extractText(picture: Picture): Promise<string> {
    const body = this.getRequestBody(picture);

    return this
      .httpClient
      .post(visionApiUrl(), body, {
      })
      .toPromise()
      .then((response: AnnotateImageResponse) => this.handleVisionResponse(response));
  }

  private getRequestBody(picture: Picture): VisionRequest {
    return {
      requests: [{
        image: {
          content: ''
        },
        features: [{
          type: VisionFeatureType.DOCUMENT_TEXT_DETECTION,
          maxResults: 1
        }]
      }]
    }
  }

  private handleVisionResponse(response: AnnotateImageResponse): string {
    return response.fullTextAnnotation.text;
  }
}


