import { Product, Status } from './product-model';

describe('Product', () => {
  it('should have a status of NotScanned if it has no scan date', () => {
    // given an unscanned product
    const product = Product.from({ name: 'foo' });
    // when status is checked
    const status = product.status;
    // it should refect that in status
    expect(status).toBe(Status.NotScanned);
  });

  it('should have a status of NothingFound scanned w/ no allergens', () => {
    // given a scanned product w/ no allergens
    const product = Product.from({
      name: 'foo',
      dateScanned: new Date(),
      allergens: []
    });
    // when status is checked
    const status = product.status;
    // it should refect that in status
    expect(status).toBe(Status.NothingFound);
  });
});
