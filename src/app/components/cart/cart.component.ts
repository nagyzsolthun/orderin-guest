import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import CartItem from 'src/app/domain/CartItem';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items$: Observable<CartItem[]>;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.items$ = this.cartService.getItems();
  }

}
