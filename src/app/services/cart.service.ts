import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import CartItem from '../domain/CartItem';
import ProductItem from '../domain/ProductItem';
import Product from '../domain/Product';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private idToItem = new Map<string,CartItem>();   // key is productId|portionId
  private items$ = new ReplaySubject<CartItem[]>(1);

  constructor(private i18nService: I18nService) { }

  count(): Observable<number> {
    return this.items$.pipe(
      map(items => items.map(item => item.count)),
      map(counts => counts.reduce((sum,count) => sum + count))
    );
  }

  prices(): Observable<Map<string,number>> {
    return this.items$.pipe(
      map(items => items.map(item => this.itemLocalPrice(item))),
      switchMap(itemPriceObservables => combineLatest(...itemPriceObservables) as Observable<[[string,number]]> ),
      map(itemPrices => this.sumPrices(itemPrices))
    );
  }

  items(): Observable<CartItem[]> {
    return this.items$;
  }

  add(product: Product, item: ProductItem) {
    const cartItem = this.calcCartItem(product, item);
    cartItem.count++;
    this.items$.next(Array.from(this.idToItem.values()))
  }

  private itemLocalPrice(item: CartItem): Observable<[string,number]> {
    const currency = this.i18nService.localCurrency(item.price);
    const amount = this.i18nService.localValue(item.price).pipe(map(amount => amount * item.count));
    return combineLatest(currency, amount);
  }
  
  private sumPrices(prices: [[string,number]]): Map<string,number> {
    const result = new Map<string,number>();
    prices.forEach(price => {
      const currency = price[0];
      const amount = price[1];
      const currenySum = result.get(currency) || 0;
      result.set(currency, currenySum + amount);
    });
    return result;
  }

  private calcCartItem(product: Product, item: ProductItem) {
    const itemId = product.id + "|" + item.portion;
    const existing = this.idToItem.get(itemId);
    if(existing) {
      return existing;
    }

    const result = CartItem.fromObjects(product, item);
    this.idToItem.set(itemId, result);
    return result;
  }
}
