import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import OrderItem from 'src/app/domain/OrderItem';
import { I18nService } from 'src/app/services/i18n.service';
import { CartItemComponent } from './cart-item.component';

class MockI18nService {
  localText(i18n: Map<string, string>) { return of(i18n.get("en")) }
  localCurrency(price: Map<string, number>) { return of("HUF") }
  localAmount(price: Map<string, number>) { return of(price.get("HUF")) }
}

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartItemComponent ],
      providers: [
        { provide: I18nService, useClass: MockI18nService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const orderItem = OrderItem.fromJson({productId:"productId", portionId:"portionId", productName:{en:"Product"}, portionName:{en:"Portion"}, price: {HUF:1000}, count: 1});

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.item = orderItem;
    fixture.detectChanges();
  });

  it('should show product and portion names', () => {
    const renderedProductName = fixture.debugElement.query(By.css('.productName')).nativeElement.innerText;
    const renderedPortionName = fixture.debugElement.query(By.css('.portionName')).nativeElement.innerText;
    const renderedPrice = fixture.debugElement.query(By.css('.price')).nativeElement.innerText;

    expect(renderedProductName).toBe("Product");
    expect(renderedPortionName).toContain("Portion");
    expect(renderedPrice).toBe("1000 HUF");
  });
});
