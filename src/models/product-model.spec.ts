import { Product, Status } from './product-model';
import { Allergen } from './allergen-model';

describe('Product', () => {
  let product: Product;
  let status: Status;

  beforeEach(() => {
    product = null;
  });

  it('should have a status of NotScanned if it has no scan date', () => {
    // given an unscanned product
    product = Product.from({ name: 'foo' });
    // when status is checked
    status = product.status;
    // it should refect that in status
    expect(status).toBe(Status.NotScanned);
  });

  it('should have a status of NothingFound if scanned w/ no allergens', () => {
    // given a scanned product w/ no allergens
    product = Product.from({
      name: 'foo',
      dateScanned: new Date(),
      allergens: []
    });
    // when status is checked
    status = product.status;
    // it should refect that in status
    expect(status).toBe(Status.NothingFound);
  });

  it('should have a status of SomethingFound if scanned w/ allergens', () => {
    // given a scanned product w/ no allergens
    product = Product.from({
      name: 'foo',
      dateScanned: new Date(),
      allergens: [Allergen.from({ name: 'bar' })]
    });
    // when status is checked
    status = product.status;
    // it should refect that in status
    expect(status).toBe(Status.SomethingFound);
  });

  it('should provide list of allergen names when asked', () => {
    product = Product.from({
      name: 'foo',
      dateScanned: new Date(),
      allergens: [Allergen.from({ name: 'bar' })]
    });

    const allergenNames = product.allergenNames();
    expect(allergenNames).toEqual(['bar'])
  });
});
