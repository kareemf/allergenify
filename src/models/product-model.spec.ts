import { Product } from './product-model';
import { Allergen } from './allergen-model';
import { Picture, Status } from './picture-model';
import { Stats } from 'fs';

describe('Product', () => {
  let product: Product;

  beforeEach(() => {
    product = null;
  });

  describe('Status (Transient)', () => {
    let status: Status;

    beforeEach(() => {
      status = null;
    });

    it('should be unscanned if no pictures', () => {
      givenAProductWithoutPictures();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NotScanned);
    });

    it('should have the highest status of its pictures 1', () => {
      givenAProductWithUnscannedPicture();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NotScanned);
    });

    it('should have the highest status of its pictures 2', () => {
      givenAProductWithPicturesOfStatus(Status.NotScanned, Status.NothingFound);
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NothingFound);
    });

    it('should have the highest status of its pictures 3', () => {
      givenAProductWithPicturesOfStatus(Status.NotScanned, Status.NothingFound, Status.SomethingFound);
      whenStatusIsChecked();
      thenStatusShouldBe(Status.SomethingFound);
    });

    function givenAProductWithUnscannedPicture() {
      makeProduct([makePicture(Status.NotScanned)]);
    }

    function givenAProductWithPicturesOfStatus(...args) {
      const pictures = args.map(stat => makePicture(stat));

      makeProduct(pictures);
    }

    function makePicture(_status: Status) {
      return Picture.from({
        name: _status,
        status: _status
      });
    }

    function whenStatusIsChecked() {
      status = product.status;
    }

    function thenStatusShouldBe(status: Status) {
      expect(status).toBe(status);
    }
  });

  describe('Date Scanned (Transient)', () => {
    let dateScanned: Date;

    beforeEach(() => {
      dateScanned = null;
    });

    it('should have no dateScanned if it has no pics', () => {
      givenAProductWithoutPictures();
      whenDateScannedIsChecked();
      thenDateScannedIs(null);
    });

    function whenDateScannedIsChecked() {
      dateScanned = product.dateScanned;
    }

    function thenDateScannedIs(expectedDate: Date) {
      expect(expectedDate).toBe(dateScanned);
    }
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

  function givenAProductWithoutPictures() {
    makeProduct([]);
  }

  function givenScannedProductWithAllergens(): void {
    const picture  = Picture.from({
      name: 'nikon',
      allergens: [Allergen.from({ name: 'bar' })]
    });

    makeProduct([picture]);
  }

  function makeProduct(pictures) {
    product = Product.from({
      name: 'foo',
      pictures
    });
  }
});
