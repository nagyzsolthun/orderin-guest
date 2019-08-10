import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-sendorder-button',
  templateUrl: './sendorder-button.component.html',
  styleUrls: ['./sendorder-button.component.css']
})
export class SendOrderButtonComponent implements OnInit {

  price$: Observable<string>;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.price$ = this.cartService.getPrice().pipe(map(price =>
      Array.from(price.keys())
      .map(currency => price.get(currency) + " " + currency)
      .join(" + ")
    ));
  }

  sendOrder() {
    this.cartService.sendOrder();
  }

}