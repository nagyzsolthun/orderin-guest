import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { map, switchMap } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { I18nService } from 'src/app/services/i18n.service';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.css']
})
export class CartButtonComponent implements OnInit {

  data$: Observable<{tableId:string, count:number, price:string}>;

  constructor(
    private routeParamsService: RouteParamsService,
    private i18nService: I18nService,
    private cartService: CartService) { }

  ngOnInit() {
    const tableId$ = this.routeParamsService.tableId();
    const count$ = this.cartService.count();
    const prices$ = this.cartService.prices().pipe(map(prices => prices.map(price => price.value + " " + price.currency)));
    this.data$ = combineLatest(tableId$, count$, prices$).pipe(map(values => {
      const tableId = values[0];
      const count = values[1];
      const prices = values[2];

      // so no cart will be shown
      if(!count) {
        return null;
      }

      const price = prices.join(" + ");
      return { tableId, count, price };
    }))
  }

}