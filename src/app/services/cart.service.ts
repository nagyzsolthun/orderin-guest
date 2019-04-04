import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import Product from '../domain/Product';
import Item from '../domain/Item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  count(): Observable<number> {
    return of(7);
  }

  prices(): Observable<{value:number, currency:string}[]> {
    const price1 = {value:1000, currency:"HUF"};
    const price2 = {value:3, currency:"EUR"};
    return of([price1, price2]);
  }
}
