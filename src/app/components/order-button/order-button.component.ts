import { Component, OnInit, Input, HostListener } from '@angular/core';
import Order from 'src/app/domain/Order';

@Component({
  selector: 'app-order-button',
  templateUrl: './order-button.component.html',
  styleUrls: ['./order-button.component.css']
})
export class OrderButtonComponent implements OnInit {

  @Input() order: Order;
  formattedCounter: string;

  constructor() { }

  ngOnInit() {
    this.formattedCounter = OrderButtonComponent.formatCounter(this.order.counter);
  }

  @HostListener("click")
  openOrder() {
    console.log("order clicked", this.order.counter);
    // TODO navigate
  }

  private static formatCounter(counter: number): string {
    if(counter > 99) return counter.toString();
    if(counter > 9) return "0" + counter;
    if(counter > 0) return "00" + counter;
    return counter.toString(); // negative, should never reach

  }

}
