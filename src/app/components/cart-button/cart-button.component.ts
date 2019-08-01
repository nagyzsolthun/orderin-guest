import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.css']
})
export class CartButtonComponent implements OnInit {

  data$: Observable<{tableId:string, count:number, price: string}>;

  constructor(
    private routeParamsService: RouteParamsService,
    private cartService: CartService) { }

  ngOnInit() {
    const tableId$ = this.routeParamsService.tableId();
    const count$ = this.cartService.count();
    const price$ = this.cartService.price().pipe(map(price =>
      Array.from(price.keys())
      .map(currency => price.get(currency) + " " + currency)
      .join(" + ")
    ));
    this.data$ = combineLatest(tableId$, count$, price$).pipe(map( ([tableId, count, price]) => {
      // so no cart will be shown
      if(!count) {
        return null;
      }
      return { tableId, count, price };
    }))
  }

}