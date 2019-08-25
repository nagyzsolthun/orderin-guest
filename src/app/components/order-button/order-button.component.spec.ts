import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderButtonComponent } from './order-button.component';
import Order from 'src/app/domain/Order';

describe('OrderButtonComponent', () => {
  let fixture: ComponentFixture<OrderButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderButtonComponent);
    fixture.componentInstance.order = Order.fromJson({id: "id1", counter: "001", orderItems: []});
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show counter', () => {
    const counter = compiled.querySelector(".counter").innerHTML;
    expect(counter).toBe("001");
  });
});
