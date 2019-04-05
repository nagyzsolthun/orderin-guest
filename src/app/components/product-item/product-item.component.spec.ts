import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemComponent } from './product-item.component';
import { I18nService } from 'src/app/services/i18n.service';
import { of } from 'rxjs';
import Item from 'src/app/domain/Item';
import { first } from 'rxjs/operators';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockI18nService {
  localText(values: Map<string, string>) {
    return of(values.get("hu"));
  }
  localCurrency(prices: Map<string, number>) {
    return of("HUF");
  }
  localValue(prices: Map<string, number>) {
    return of(prices.get("HUF"))
  }
}

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductItemComponent],
      providers: [
        { provide: I18nService, useClass: MockI18nService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
  });

  it('should show the correct name,price,currency', () => {
    component.item = Item.fromJson({ name: { hu: "Tétel", en: "Item" }, price: { HUF: 490, EUR: 2 } })
    fixture.detectChanges();

    component.name$.pipe(first()).subscribe(name => expect(name).toBe("Tétel"));
    component.currency$.pipe(first()).subscribe(currency => expect(currency).toBe("HUF"));
    component.value$.pipe(first()).subscribe(value => expect(value).toBe(490));
  });
});
