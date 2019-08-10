import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import OrderItem from 'src/app/domain/OrderItem';
import { I18nService } from 'src/app/services/i18n.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() item: OrderItem;

  productName$: Observable<string>;
  portionName$: Observable<string>;
  priceAmount$: Observable<number>;
  priceCurrency$: Observable<string>;
  count: number;

  constructor(private i18nService: I18nService) { }

  ngOnInit() {
    this.productName$ = this.i18nService.localText(this.item.productName);
    this.portionName$ = this.i18nService.localText(this.item.portionName);
    this.priceAmount$ = this.i18nService.localAmount(this.item.price).pipe(map(amount => amount*this.item.count));
    this.priceCurrency$ = this.i18nService.localCurrency(this.item.price);
    this.count = this.item.count;
  }

}
