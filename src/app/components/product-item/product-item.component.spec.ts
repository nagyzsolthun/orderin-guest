import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemComponent } from './product-item.component';
import { I18nService } from 'src/app/services/i18n.service';
import { of } from 'rxjs';
import ProductItem from 'src/app/domain/ProductItem';
import { first } from 'rxjs/operators';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockI18nService {
  localText(i18n: Map<string, string>) {
    return of(i18n.get("hu"));
  }
  localCurrency(price: Map<string, number>) {
    return of("HUF");
  }
  localAmount(price: Map<string, number>) {
    return of(price.get("HUF"))
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
    component.item = ProductItem.fromJson({ name: { hu: "Tétel", en: "Item" }, price: { HUF: 490, EUR: 2 } })
    fixture.detectChanges();

    component.name$.pipe(first()).subscribe(name => expect(name).toBe("Tétel"));
    component.currency$.pipe(first()).subscribe(currency => expect(currency).toBe("HUF"));
    component.amount$.pipe(first()).subscribe(amount => expect(amount).toBe(490));
  });
});
