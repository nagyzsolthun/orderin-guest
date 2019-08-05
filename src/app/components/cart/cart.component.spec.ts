import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, ReplaySubject } from 'rxjs';
import CartItem from 'src/app/domain/CartItem';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

class MockCartService {
  items$ = new ReplaySubject<CartItem[]>(1);
  getItems() { return this.items$; }
}

class MockRouteParamsService {
  tableId() { return of("tableId"); }
}

class MockRouter {
  navigate() { }
}

describe('CartComponent', () => {

  let cartService: MockCartService;
  let router: MockRouter;

  let fixture: ComponentFixture<CartComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CartComponent
      ],
      providers: [
        { provide: CartService, useClass: MockCartService },
        { provide: RouteParamsService, useClass: MockRouteParamsService },
        { provide: Router, useClass: MockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    cartService = TestBed.get(CartService);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(CartComponent);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show items', () => {
    const item1 = CartItem.fromJson({
      productId: "productId1",
      portionId: "portionId1",
      productName: {en: "product1"},
      portionName: {en: "portion1"},
      price: { HUF: 300 },
      count: 1
    });

    const item2 = CartItem.fromJson({
      productId: "productId2",
      portionId: "portionId2",
      productName: {en: "product2"},
      portionName: {en: "portion2"},
      price: { HUF: 600 },
      count: 2
    });

    cartService.items$.next([item1,item2]);
    fixture.detectChanges();
    
    const itemElements = compiled.querySelectorAll("app-cart-item");
    expect(itemElements.length).toBe(2);
  });

  it('should redirect when cart is empty', () => {
    spyOn(router, 'navigate');
    cartService.items$.next([]);
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(["tableId"]);
  });
  
});
