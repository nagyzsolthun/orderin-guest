import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Order from '../domain/Order';
import { HttpCacheService } from './http-cache.service';
import { switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private dataService: DataService,
    private httpCacheService: HttpCacheService) { }

  getOrders(): Observable<Order[]> {
    const requestTime = Date.now(); // to get through the cache
    return this.dataService.venue().pipe(
      map(venue => venue.id),
      switchMap(venueId => {
        const url = `${environment.apiUrl}/fetchOrders`;
        const params = {venueId, requestTime};
        return this.httpCacheService.get(url, params);
      }),
      map(orders => orders.map(Order.fromJson))
    );
  }
}
