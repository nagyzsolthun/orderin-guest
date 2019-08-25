import { Component, Input, HostListener } from '@angular/core';
import Order from 'src/app/domain/Order';

@Component({
  selector: 'app-order-button',
  templateUrl: './order-button.component.html',
  styleUrls: ['./order-button.component.css']
})
export class OrderButtonComponent {

  @Input() order: Order;

  constructor() { }

  @HostListener("click")
  openOrder() {
    console.log("order clicked", this.order.counter);
    // TODO navigate
  }

}
