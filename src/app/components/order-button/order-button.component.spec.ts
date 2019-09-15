import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderButtonComponent } from './order-button.component';
import Order from 'src/app/domain/Order';
import { of } from 'rxjs';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockRouteParamsService {
  tableId = () => of("tableId");
}

describe('OrderButtonComponent', () => {
  let fixture: ComponentFixture<OrderButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderButtonComponent ],
      providers: [
        { provide: RouteParamsService, useClass: MockRouteParamsService },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderButtonComponent);
    fixture.componentInstance.order = Order.fromJson({id: "id1", counter: "001", orderItems: [], state: "CREATED"});
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show counter', () => {
    const counter = compiled.querySelector(".counter").innerHTML;
    expect(counter).toBe("001");
  });

  it('should show counter', () => {
    const state = compiled.querySelector(".state").innerHTML;
    expect(state).toBe("CREATED");
  });
});
