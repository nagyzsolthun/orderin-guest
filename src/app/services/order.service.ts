import { Injectable, NgZone } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import Order from '../domain/Order';
import { HttpCacheService } from './http-cache.service';
import { switchMap, map, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartService } from './cart.service';
import { RouteParamsService } from './route-params.service';
import OrderUpdate from '../domain/OrderUpdate';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders = new Array<Order>();
  private orders$ = new ReplaySubject<Order[]>(1);

  constructor(
      private ngZone: NgZone,
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
    ).subscribe(orders => orders.forEach(order => this.createOrder(order)));

    routeParamsService.tableId().pipe(first()).subscribe(tableId => {
      const url = `${environment.apiUrl}/tables/${tableId}/events`;
      const eventSource = new EventSource(url);
      eventSource.onmessage = message => this.onServerEvent(message);
    });
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
      this.createOrder(order);
      this.cartService.clear()
    });
  }

  private onServerEvent(message: MessageEvent) {
    const data = JSON.parse(message.data);

    // use ngZone, otherwise async in template does not react
    if(data.orderId) {
      const orderUpdate = OrderUpdate.fromJson(data);
      this.ngZone.run(() => this.updateOrder(orderUpdate));
      return;
    }

    // otherwise heartbeat
  }

  private createOrder(order: Order) {
    const existing = this.orders.find(o => o.id == order.id);
    if(existing) {
      // race condition, subscribe to events before fetching orders
      return;
    }

    this.orders.push(order);
    this.orders$.next(this.orders);
  }

  private updateOrder(orderUpdate: OrderUpdate) {
    const order = this.orders.find(order => order.id == orderUpdate.orderId);
    if(order) {
      order.state = orderUpdate.state;
      this.orders$.next(this.orders);
    }
  }
}
