import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import ProductItem from 'src/app/domain/ProductItem';
import { I18nService } from 'src/app/services/i18n.service';
import { CartService } from 'src/app/services/cart.service';
import Product from 'src/app/domain/Product';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product;
  @Input() item: ProductItem;

  name$: Observable<string>;
  amount$: Observable<number>;
  currency$: Observable<string>

  constructor(
    private i18nService: I18nService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.name$ = this.i18nService.localText(this.item.name);
    this.amount$ = this.i18nService.localAmount(this.item.price);
    this.currency$ = this.i18nService.localCurrency(this.item.price);
  }

  @HostListener('click')
  addToCart() {
    this.cartService.addItem(this.product, this.item);
  }

}
