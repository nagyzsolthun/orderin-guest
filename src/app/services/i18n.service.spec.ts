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
    localText.pipe(first()).subscribe(value => expect(value).toBe("English"));

    service.setLanguage("hu");
    localText.pipe(first()).subscribe(value => expect(value).toBe("Magyar"));

    service.setLanguage("non-existing");
    localText.pipe(first()).subscribe(value => expect(value).toBe("English"));

  });

  it('should react on currency changes', () => {
    const service: I18nService = TestBed.get(I18nService);
    const prices = new Map(Object.entries({HUF:490, EUR:2.5}));
    const localCurrency = service.localCurrency(prices);
    const localValue = service.localValue(prices);
    

    service.setCurrency("HUF")
    localCurrency.pipe(first()).subscribe(currency => expect(currency).toBe("HUF"));
    localValue.pipe(first()).subscribe(value => expect(value).toBe(490));

    service.setCurrency("EUR");
    localCurrency.pipe(first()).subscribe(currency => expect(currency).toBe("EUR"));
    localValue.pipe(first()).subscribe(value => expect(value).toBe(2.5));

    service.setCurrency("non-existent");
    localCurrency.pipe(first()).subscribe(currency => expect(currency).toBe("HUF"));  // first wins
    localValue.pipe(first()).subscribe(value => expect(value).toBe(490));
  });
});
