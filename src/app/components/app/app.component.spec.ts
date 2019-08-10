import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import Order from 'src/app/domain/Order';
import { OrderService } from 'src/app/services/order.service';


class MockOrderService {
  getOrders() {
    const order1 = Order.fromJson({id: "id1", counter: 1, orderItems: []});
    const order2 = Order.fromJson({id: "id2", counter: 2, orderItems: []});
    return of([order1, order2]);
  }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      providers: [
        { provide: OrderService, useClass: MockOrderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show order-buttons', () => {
    const orderButtonElements = compiled.querySelectorAll("app-order-button");
    expect(orderButtonElements.length).toBe(2);
  });
  
});
