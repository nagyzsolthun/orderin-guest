import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import Order from 'src/app/domain/Order';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orders$ = this.orderService.getOrders();
  }
}
