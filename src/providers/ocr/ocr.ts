import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../models/picture-model';
import { VISION_API_KEY  } from './access-config';

@Injectable()
export class OcrProvider {
  private static BASE_VISION_API_URL= "https://vision.googleapis.com/v1/images:annotate?key=";

  constructor(private httpClient: HttpClient) {
    this.getDocumentTextRequestBody = this.getDocumentTextRequestBody.bind(this);
    this.makeVisionRequest = this.makeVisionRequest.bind(this);
    this.handleVisionResponse = this.handleVisionResponse.bind(this);
  }

  extractText(picture: Picture): Promise<string> {
     const req = this.getDocumentTextRequestBody(picture.name);
     return this.makeVisionRequest(req);
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
