import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import Order from '../domain/Order';
import { HttpCacheService } from './http-cache.service';
import { switchMap, map, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartService } from './cart.service';
import { RouteParamsService } from './route-params.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders = new Array<Order>();
  private orders$ = new ReplaySubject<Order[]>(1);

  constructor(
      private routeParamsService: RouteParamsService,
      dataService: DataService,
      private http: HttpClient,
      private cartService: CartService) {
    const requestTime = Date.now().toString(); // to get through the cache
    dataService.venue().pipe(
      map(venue => venue.id),
      switchMap(venueId => {
        const params = new URLSearchParams({venueId, requestTime});
        const url = `${environment.apiUrl}/fetchOrders?${params.toString()}`;
        return this.http.get(url)
      }),
      map(response => response as any[]),
      map(orders => orders.map(Order.fromJson))
    ).subscribe(orders => orders.forEach(order => this.updateOrder(order)));
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  sendOrder() {
    const url = `${environment.apiUrl}/sendOrder`;
    this.routeParamsService.tableId().pipe(first(), switchMap(tableId => {
      const params = new HttpParams().set("tableId", tableId);
      return this.http.put(url, {}, {params});
    }), map(order => Order.fromJson(order))).subscribe(order => {
      this.updateOrder(order);
      this.cartService.clear()
    });
  }

  private updateOrder(order: Order) {
    const existing = this.orders.find(o => o.id == order.id);
    if(existing) {
      existing.counter = order.counter;
      existing.orderItems = order.orderItems;
      this.orders$.next(this.orders);
      return;
    }

    this.orders.push(order);
    this.orders$.next(this.orders);
  }
}
