import { TestBed, async } from '@angular/core/testing';

import { OrderService } from './order.service';
import Venue from '../domain/Venue';
import { of, ReplaySubject } from 'rxjs';
import { DataService } from './data.service';
import Order from '../domain/Order';
import OrderItem from '../domain/OrderItem';
import { HttpCacheService } from './http-cache.service';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RouteParamsService } from './route-params.service';
import { CartService } from './cart.service';

class MockRouteparamsService {
  tableId() { return of("tableId") }
}

class MockDataService {
  venue() {
    return of(Venue.fromJson({ id: "venueId", name: "venueName" }));
  }
}

class MockCartService {
  clear() { }
}

class MockHttpClient {
  get(url:string, params:any) {
    const order1 = Order.fromJson({id: "id1", counter: 1, orderItems: []});
    const order2 = Order.fromJson({id: "id2", counter: 2, orderItems: []});
    return of([order1, order2]);
  }

  put(url:string, params:any) {
    const order3 = Order.fromJson({id: "id3", counter: 3, orderItems: []});
    return of(order3);
  }
}

describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: RouteParamsService, useClass: MockRouteparamsService },
        { provide: DataService, useClass: MockDataService },
        { provide: CartService, useClass: MockCartService },
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    });
  });

  it('should fetch orders', async(() => {
    const service = TestBed.get(OrderService) as OrderService;
    service.getOrders().pipe(first()).subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders[0].id).toBe("id1");
      expect(orders[1].id).toBe("id2");
    })
  }));

  it('should update orders when sent', async(() => {
    const cartService = TestBed.get(CartService) as CartService;
    const service = TestBed.get(OrderService) as OrderService;

    spyOn(cartService, "clear");
    service.sendOrder();

    expect(cartService.clear).toHaveBeenCalled();
    service.getOrders().pipe(first()).subscribe(orders => {
      expect(orders.length).toBe(3);
      expect(orders[0].id).toBe("id1");
      expect(orders[1].id).toBe("id2");
      expect(orders[2].id).toBe("id3");
    });
    
  }));
});
