import { Product } from './product-model';
import { Allergen } from './allergen-model';
import { Picture } from './picture-model';

describe('Product', () => {
  let product: Product;

  beforeEach(() => {
    product = null;
  });

  describe('Matching', () => {
    let isAllergenMatch: boolean;

    it('should flag word as match', () => {
      givenScannedProductWithAllergens();
      whenWordIsChecked('bar');
      thenMatchIsFound();
    });

    it('should flag word as match insenitive', () => {
      givenScannedProductWithAllergens();
      whenWordIsChecked('Bar');
      thenMatchIsFound();
    });

    function whenWordIsChecked(word: string) {
      isAllergenMatch = product.isAllergenMatch(word);
    }

    function thenMatchIsFound() {
      expect(isAllergenMatch).toBeTruthy();
    }
  });

  function givenScannedProductWithAllergens(): void {
    const picture  = Picture.from({
      allergens: [Allergen.from({ name: 'bar' })]
    });

    product = Product.from({
      name: 'foo',
      dateScanned: new Date(),
      pictures: [picture]
    });
  }
});
