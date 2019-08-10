import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendOrderButtonComponent } from './sendorder-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { of } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import Order from 'src/app/domain/Order';

class MockCartService {
  getPrice() { return of(new Map([["EUR", 3], ["HUF", 1000]])); }
}

class MockOrderService {
  sendOrder() {}
}

describe('SendOrderButtonComponent', () => {
  let component: SendOrderButtonComponent;
  let fixture: ComponentFixture<SendOrderButtonComponent>;
  let compiled: HTMLElement;

  let cartService: MockCartService;
  let orderService: MockOrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendOrderButtonComponent ],
      providers: [
        { provide: CartService, useClass: MockCartService },
        { provide: OrderService, useClass: MockOrderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    cartService = TestBed.get(CartService);
    orderService = TestBed.get(OrderService);

    fixture = TestBed.createComponent(SendOrderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show the price coming from cartService', () => {
    const renderedPrice = compiled.querySelector('.price').textContent;
    expect(renderedPrice).toBe("3 EUR + 1000 HUF");
  });

  it('sends order when clicked', () => {
    spyOn(orderService, "sendOrder");
    component.sendOrder();  // TODO should be through click
    fixture.detectChanges();
    expect(orderService.sendOrder).toHaveBeenCalled();
  });
});
