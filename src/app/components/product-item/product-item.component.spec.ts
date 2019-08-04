import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemComponent } from './product-item.component';
import { I18nService } from 'src/app/services/i18n.service';
import { of } from 'rxjs';
import ProductItem from 'src/app/domain/ProductItem';
import Product from 'src/app/domain/Product';
import { CartService } from 'src/app/services/cart.service';

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

class MockCartService {
  addItem(product: Product, item: ProductItem) { }
}

describe('ProductItemComponent', () => {
  let fixture: ComponentFixture<ProductItemComponent>;
  let component: ProductItemComponent;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductItemComponent],
      providers: [
        { provide: I18nService, useClass: MockI18nService },
        { provide: CartService, useClass: MockCartService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show the correct name and price', () => {
    component.item = ProductItem.fromJson({ name: { hu: "Tétel", en: "Item" }, price: { HUF: 490, EUR: 2 } })
    fixture.detectChanges();
    expect(compiled.querySelector(".name").textContent).toBe("Tétel");
    expect(compiled.querySelector(".price").textContent).toBe("490 HUF");
  });

  it('should add item to cart when clicked', () => {
    const cartService = TestBed.get(CartService);
    spyOn(cartService, 'addItem');

    component.product = Product.fromJson({ name: { hu: "Termék", en: "Product" } });
    component.item = ProductItem.fromJson({ name: { hu: "Tétel", en: "Item" }, price: { HUF: 490, EUR: 2 } });
    fixture.detectChanges();
    
    compiled.click();
    expect(cartService.addItem).toHaveBeenCalledWith(component.product, component.item);
  });
});
