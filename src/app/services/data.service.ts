import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, tap, shareReplay, first } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import Category from '../domain/Category';
import InitState from '../domain/InitState';
import Product from '../domain/Product';
import { HttpCacheService } from './http-cache.service';
import { RouteParamsService } from './route-params.service';
import { I18nService } from './i18n.service';
import ProductItem from '../domain/ProductItem';
import Venue from '../domain/Venue';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private initState$: Observable<InitState>;
  private openedProduct$ = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpCacheService,
    private routeParamsService: RouteParamsService) {

    this.initState$ = this.routeParamsService.tableId()
      .pipe(switchMap(tableId => this.initState(tableId)))
  }

  venue(): Observable<Venue> {
    return this.initState$.pipe(map(state => state.venue));
  }

  rootCategories(): Observable<Array<Category>> {
    return this.initState$.pipe(map(state => state.rootCategories));
  }

  productsOf(categoryEnglishName: string): Observable<Product[]> {
    return this.categoryIdByEnglishName(categoryEnglishName)
      .pipe(switchMap(categoryId => this.productsOfCategory(categoryId)));
  }

  itemsOf(productId: string): Observable<ProductItem[]> {
    return this.initState$.pipe(
      map(state => state.venue.id),
      switchMap(venueId => this.itemsOfProduct(venueId,productId))
    );
  }

  openedProduct(): Observable<string> {
    return this.openedProduct$;
  }

  openProdut(productId: string) {
    this.openedProduct$.pipe(first())
      .subscribe(openedProduct => this.openedProduct$.next(openedProduct != productId ? productId : null))
  }

  private initState(tableId: string): Observable<InitState> {
    const url = `${environment.apiUrl}/initStateOfTable/${tableId}`;
    return this.http.get(url).pipe(map(json => InitState.fromJson(json)));
  }

  private productsOfCategory(categoryId: string): Observable<Product[]> {
    const url = `${environment.apiUrl}/productsOfCategory/${categoryId}`;
    return this.http.get(url)
      .pipe(map(jsonArr => Product.fromJsonArr(jsonArr)));
  }

  private categoryIdByEnglishName(categoryEnglishName: string): Observable<string> {
    return this.initState$.pipe(
      map(state => state.rootCategories.find(category => I18nService.toEnglish(category.name) == categoryEnglishName).id)
    );
  }

  private itemsOfProduct(venueId: string, productId: string): Observable<ProductItem[]> {
    const url = `${environment.apiUrl}/itemsOfProduct/${venueId}/${productId}`;
    return this.http.get(url)
      .pipe(map(json => ProductItem.fromJsonArr(json)));
  }
}
