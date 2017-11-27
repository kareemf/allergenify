import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../models/picture-model';
import { VISION_ACCESS_TOKEN, VISION_API_KEY  } from './access-config';

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

// interface EntityAnnotation {
//   mid: string,
//   locale: string,
//   description: string,
//   score: number,
//   confidence: number,
//   topicality: number,
// }

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
    const body = null;

    return this
      .httpClient
      .post(visionApiUrl(), body)
      .toPromise()
      .then((response: AnnotateImageResponse) => this.handleVisionResponse(response));
    //return Promise.resolve("PATIENT INFORMATION SHEET CHEMOTECHNIQUE DIAGNOSTICS First in Patch Testing. Since 1981 DORMER LABORATORIES INC. www.dormer.com Sesquiterpene Lactone Mix (MX18) Your patch testing results indicate that you have a contact allergy to Sesquiterpene Lactone Mix. It is important that you familiarize yourself with this chemical and take steps to avoid coming in contact with it. What is Sesquiterpene Lactone Mix and where is it found? Sesquiterpene Lactone Mix contains four chemicals; alantolactone, dehydrocostus lacte nv plants from the Compositae plant Saussurea lappa or Asteraceae family. This plant oximately 20,000 species of which about 200 are known to cause dermatitis, Some ornamental annuals (chrysanthemums). These chemicals are used in lotions, examples are daisy, sunflower, weeds, ornamental annuals (chrysanthemums). These che ments, creams and topical medications. Further research may identify additional product or perfumes, cosmetics, ointments, creams and topical medications. Further industrial usages of this chemical. What else is Sesquiterpene Lactone Mix called This chemical can be identified by different names, including: CAS RN.553-21-9 Alantolactone Dehydrocostunolide Costunolide Dehydrocostus Lactone Costus Lactone CAS RN: 477-43-0 This may not be a complete list as manufacturers introduce and delete chemicals from their product lines. THINGS YOU CAN DO TO HELP MANAGE YOUR CONTACT ALLERGY V Be vigilant ... read the product label. Always take the time to read the ingredient listing on product packages. This should be your first step each time you purchase a product as manufacturers sometimes change product ingredients. If you have any concerns ask your pharmacist or your doctor. 7 Test the product first. If you have purchased a new product you should test it on a small skin area to see if you get a reaction before using the product on larger skin areas. V Advise people you obtain services from of your contact allergy. This should include people like your pharmacist. doctor, hairdresser, florist, veterinarian, etc. Z inform your employer if the source of your contact allergy is work related. You should identify the specific source of the chemical and take the necessary steps to avoid further exposure. Protective wear may be adequate or you may need to make a change in your work activities. Both you and your employer benefit when the cause of your nominational dermatitis is eliminated. of ingredient information that can be searched by product, by");
  }

  private handleVisionResponse(response: AnnotateImageResponse): string {
    return response.fullTextAnnotation.text;
  }
}


