import { AllergensProvider } from './allergens-provider';
import { Allergen } from '../../models/allergen-model';
import { StorageMock } from '../../../test-config/stoage-mock';

describe('AllergensProvider', () => {
  let provider: AllergensProvider;
  let allergen: Allergen;

  beforeEach(() => {
    allergen = Allergen.from({name: 'Foo'});
    const storage = StorageMock.instance('allergens', [allergen]);

    provider = new AllergensProvider(storage);
  });

  it('should flag word if there exists an allergen with that name', () => {
    // given allergen "foo"
    // when text is checked for allergens
    provider
    .checkForAllergens('Foo')
    .then(results => {
      // then text is matched
      expect(results).toContain(allergen);
    });
  });
});
