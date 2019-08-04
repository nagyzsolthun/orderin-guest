import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, ReplaySubject } from 'rxjs';
import { map, switchMap, first, shareReplay, tap } from 'rxjs/operators';
import CartItem from '../domain/CartItem';
import ProductItem from '../domain/ProductItem';
import Product from '../domain/Product';
import { I18nService } from './i18n.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items = new Array<CartItem>();
  private items$ = new ReplaySubject<CartItem[]>(1);

  constructor(
    private dataService: DataService,
    private i18nService: I18nService,
    private http: HttpClient) {
      dataService.venue().pipe(
        map(venue => venue.id),
        map(venueId => `${environment.apiUrl}/cart/${venueId}`),
        switchMap(cartUrl => http.get(cartUrl))
      ).subscribe(cart => {
        const cartItems = cart as [];
        this.items = cartItems.map(CartItem.fromJson);
        this.items$.next(this.items);
      });
    }

  getCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.map(item => item.count)),
      map(counts => counts.reduce((sum,count) => sum + count, 0))
    );
  }

  getPrice(): Observable<Map<string,number>> {
    return this.items$.pipe(
      map(items => items.map(item => this.calcLocalPrice(item))),
      switchMap(localPriceObservables => combineLatest(...localPriceObservables) as Observable<[LocalPrice]> ),
      map(localPrices => this.sumLocalPrices(localPrices))
    );
  }

  getItems(): Observable<CartItem[]> {
    return this.items$;
  }

  addItem(product: Product, item: ProductItem) {
    const url = `${environment.apiUrl}/addToCart`;
    this.dataService.venue().pipe(first(), switchMap(venue => {
      const params = new HttpParams()
        .set("productId", product.id)
        .set("portionId", item.portion)
        .set("venueId", venue.id);
      return this.http.put(url, {}, {params});
    })).subscribe(_ => this.addToLocalCache(product,item)); // TODO loading + error handling
  }

  private calcLocalPrice(item: CartItem): Observable<LocalPrice> {
    const currency = this.i18nService.localCurrency(item.price);
    const amount = this.i18nService.localAmount(item.price).pipe(map(amount => amount * item.count));
    return combineLatest(currency, amount)
      .pipe(map( ([currency,amount]) => new LocalPrice(currency,amount)));
  }
  
  private sumLocalPrices(localPrices: LocalPrice[]): Map<string,number> {
    const result = new Map<string,number>();
    localPrices.forEach(price => {
      const currency = price.currency;
      const amount = price.amount;
      const currenySum = result.get(price.currency) || 0;
      result.set(currency, currenySum + amount);
    });
    return result;
  }

  private addToLocalCache(product: Product, productItem: ProductItem) {
    const cartItem = this.calcCartItem(product, productItem);

    cartItem.count++;
    this.items$.next(this.items);
  }

  private calcCartItem(product: Product, productItem: ProductItem) {
    const existing = this.items.find(cartItem => cartItem.productId == product.id && cartItem.portionId == productItem.portion)
    if(existing) {
      return existing;
    }

    const result = CartItem.fromObjects(product, productItem);
    this.items.push(result);
    return result;
  }
}

class LocalPrice {
  constructor(public currency: string, public amount: number) { }
}