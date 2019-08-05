import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import CartItem from 'src/app/domain/CartItem';
import { CartService } from 'src/app/services/cart.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RouteParamsService } from 'src/app/services/route-params.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy {

  items$: Observable<CartItem[]>;
  private redirectSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private routeParamsService: RouteParamsService,
    private router: Router) { }

  ngOnInit() {
    this.items$ = this.cartService.getItems();

    // redirect when cart is empty
    const tableId$ = this.routeParamsService.tableId();
    const emptyItems$ = this.items$.pipe(filter(items => !items.length));
    this.redirectSubscription = combineLatest(tableId$, emptyItems$)
      .subscribe( ([tableId, emptyItems]) => this.router.navigate([tableId]));
  }

  ngOnDestroy() {
    this.redirectSubscription.unsubscribe();
  }

}
