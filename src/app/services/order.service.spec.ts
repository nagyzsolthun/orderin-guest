import { TestBed, async } from '@angular/core/testing';

import { OrderService } from './order.service';
import Venue from '../domain/Venue';
import { of, ReplaySubject } from 'rxjs';
import { DataService } from './data.service';
import Order from '../domain/Order';
import OrderItem from '../domain/OrderItem';
import { HttpCacheService } from './http-cache.service';
import { first } from 'rxjs/operators';

class MockDataService {
  venue() {
    return of(Venue.fromJson({ id: "venueId", name: "venueName" }));
  }
}

class MockHttpCacheService {
  get(url:string, params:any) {
    const order1 = Order.fromJson({id: "id1", counter: 1, orderItems: []});
    const order2 = Order.fromJson({id: "id2", counter: 2, orderItems: []});
    return of([order1, order2]);
  }
}

describe('OrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: DataService, useClass: MockDataService },
        { provide: HttpCacheService, useClass: MockHttpCacheService }
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
});
