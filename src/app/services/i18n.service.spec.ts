import { TestBed, ComponentFixture } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { first } from 'rxjs/operators';

describe('I18nService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should react on language changes', () => {
    const service: I18nService = TestBed.get(I18nService);
    const text = new Map(Object.entries({en:"English", hu:"Magyar"}));
    const localText = service.localText(text);
    

    service.setLanguage("en");
    localText.pipe(first()).subscribe(text => expect(text).toBe("English"));

    service.setLanguage("hu");
    localText.pipe(first()).subscribe(text => expect(text).toBe("Magyar"));

    service.setLanguage("non-existing");
    localText.pipe(first()).subscribe(text => expect(text).toBe("English"));

  });

  it('should react on currency changes', () => {
    const service: I18nService = TestBed.get(I18nService);
    const price = new Map(Object.entries({HUF:490, EUR:2.5}));
    const localCurrency = service.localCurrency(price);
    const localAmount = service.localAmount(price);
    

    service.setCurrency("HUF")
    localCurrency.pipe(first()).subscribe(currency => expect(currency).toBe("HUF"));
    localAmount.pipe(first()).subscribe(amount => expect(amount).toBe(490));

    service.setCurrency("EUR");
    localCurrency.pipe(first()).subscribe(currency => expect(currency).toBe("EUR"));
    localAmount.pipe(first()).subscribe(amount => expect(amount).toBe(2.5));

    service.setCurrency("non-existent");
    localCurrency.pipe(first()).subscribe(currency => expect(currency).toBe("HUF"));  // first wins
    localAmount.pipe(first()).subscribe(amount => expect(amount).toBe(490));
  });
});
