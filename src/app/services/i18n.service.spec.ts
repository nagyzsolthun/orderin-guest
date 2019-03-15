import { TestBed, ComponentFixture } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { first } from 'rxjs/operators';

describe('I18nService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should react on language changes', () => {
    const service: I18nService = TestBed.get(I18nService);
    const values = new Map(Object.entries({en:"English", hu:"Magyar"}));
    const localValue = service.toLocal(values);

    service.update("en");
    localValue.pipe(first()).subscribe(value => expect(value).toBe("English"));

    service.update("hu");
    localValue.pipe(first()).subscribe(value => expect(value).toBe("Magyar"));
  });
});
