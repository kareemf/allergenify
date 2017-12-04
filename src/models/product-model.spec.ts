import { Product, Status } from './product-model';
import { Allergen } from './allergen-model';

describe('Product', () => {
  let product: Product;
  let status: Status;

  beforeEach(() => {
    product = null;
  });

  describe('Status', () => {
    beforeEach(() => {
      status = null;
    });

    it('should be NotScanned if it has no scan date', () => {
      // given an unscanned product
      product = Product.from({ name: 'foo' });
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NotScanned);
    });

    it('should be NothingFound if scanned w/ no allergens', () => {
      // given a scanned product w/ no allergens
      product = Product.from({
        name: 'foo',
        dateScanned: new Date(),
        allergens: []
      });
      whenStatusIsChecked();
      thenStatusShouldBe(Status.NothingFound);
    });

    it('should be SomethingFound if scanned w/ allergens', () => {
      givenScannedProductWithAllergens();
      whenStatusIsChecked();
      thenStatusShouldBe(Status.SomethingFound);
    });

    function whenStatusIsChecked() {
      status = product.status;
    }

    function thenStatusShouldBe(status: Status) {
      expect(status).toBe(status);
    }
  });

  it('should provide list of allergen names when asked', () => {
    givenScannedProductWithAllergens();

    const allergenNames = product.allergenNames();
    expect(allergenNames).toEqual(['bar'])
  });

  function givenScannedProductWithAllergens(): void {
    product = Product.from({
      name: 'foo',
      dateScanned: new Date(),
      allergens: [Allergen.from({ name: 'bar' })]
    });
  }
});
