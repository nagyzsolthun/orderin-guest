import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartButtonComponent } from './cart-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

class MockRouteParamsService {
  tableId() { return of("tableId"); }
}

class MockCartService {
  count() { return of(2); }
  prices() { return of(new Map([["EUR", 3], ["HUF", 1000]])); }
}

describe('CartButtonComponent', () => {
  let component: CartButtonComponent;
  let fixture: ComponentFixture<CartButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartButtonComponent ],
      providers: [
        { provide: RouteParamsService, useClass: MockRouteParamsService },
        { provide: CartService, useClass: MockCartService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show data based on inputs', () => {
    component.data$.pipe(first()).subscribe(data => {
      expect(data.tableId).toBe("tableId");
      expect(data.count).toBe(2);
      expect(data.price).toBe("3 EUR + 1000 HUF");
    })
  });
});
