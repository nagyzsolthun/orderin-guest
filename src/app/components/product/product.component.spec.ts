import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import Product from 'src/app/domain/Product';
import { I18nService } from 'src/app/services/i18n.service';
import { ProductComponent } from './product.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import Item from 'src/app/domain/Item';
import { DataService } from 'src/app/services/data.service';


class MockI18nService {
  localText(values: Map<string, string>) {
    return of("LocalI18n")
  }
}

class MockDataService {
  openedProduct$ = new BehaviorSubject<string>(null);
  items$ = new BehaviorSubject<Item[]>(null);
  openedProduct() {
    return this.openedProduct$;
  }
  itemsOf(productId: string) {
    return this.items$;
  }
}

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [
        { provide: I18nService, useClass: MockI18nService },
        { provide: DataService, useClass: MockDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.product = Product.fromJson({ id: "id1", name: { en: "English", hu: "Magyar" } });
  });

  it('should show name from i18nService', () => {
    fixture.detectChanges();
    component.localName$.pipe(first()).subscribe(name => expect(name).toBe("LocalI18n"))
  });

  it('should be loading when opened + no items', () => {
    const dataSerice = TestBed.get(DataService);

    fixture.detectChanges();
    component.loading$.pipe(first()).subscribe(loading => expect(loading).toBeFalsy);

    dataSerice.openedProduct$.next("id1");
    fixture.detectChanges();
    component.loading$.pipe(first()).subscribe(loading => expect(loading).toBeTruthy);
  });

  it('should not be loading when opened + items', () => {
    const dataSerice = TestBed.get(DataService);

    fixture.detectChanges();
    component.loading$.pipe(first()).subscribe(loading => expect(loading).toBeFalsy);

    dataSerice.openedProduct$.next("id1");
    dataSerice.items$.next([Item.fromJson({ name: {}, price: {} })]);
    fixture.detectChanges();
    component.loading$.pipe(first()).subscribe(loading => expect(loading).toBeFalsy);
  });

  it('should switch from loading to not loading, when items arrive', () => {
    const dataSerice = TestBed.get(DataService);

    dataSerice.openedProduct$.next("id1");
    fixture.detectChanges();
    component.loading$.pipe(first()).subscribe(loading => expect(loading).toBeTruthy);

    dataSerice.items$.next([Item.fromJson({ name: {}, price: {} })]);
    fixture.detectChanges();
    component.loading$.pipe(first()).subscribe(loading => expect(loading).toBeFalsy);
  });
});
