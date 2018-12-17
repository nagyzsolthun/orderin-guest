import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject, Subscriber, throwError } from 'rxjs';
import { map, first, filter, publishLast, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RouteService } from './route.service';
import { HttpCacheService } from './http-cache.service';
import InitState from '../domain/InitState';
import Category from '../domain/Category';
import Product from '../domain/Product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private tableIdInitState: Observable<InitState>;

  constructor(
    private http: HttpCacheService,
    private routeService: RouteService) {

    this.tableIdInitState = this.routeService.tableId()
      .pipe(switchMap(tableId => this.initState(tableId)))
  }

  rootCategories(): Observable<Array<Category>> {
    return this.tableIdInitState.pipe(map(state => state.rootCategories));
  }

  productsOf(categoryName: string): Observable<Product[]> {
    return this.categoryIdByName(categoryName)
      .pipe(switchMap(categoryId => this.productsOfCategory(categoryId)));
  }

  private initState(tableId: string): Observable<InitState> {
    console.log(`subscribing on tableId:${tableId}`);

    const url = `${environment.apiUrl}/guest/initStateOfTable/${tableId}`;
    return this.http.get(url).pipe(map(json => InitState.fromJson(json)));
  }

  private productsOfCategory(categoryId: string): Observable<Product[]> {
    const url = `${environment.apiUrl}/guest/productsOfCategory/${categoryId}`;
    return this.http.get(url)
      .pipe(map(jsonArr => Product.fromJsonArr(jsonArr)));
  }

  private categoryIdByName(categoryName: string): Observable<string> {
    return this.routeService.tableId().pipe(
      switchMap(tableId => this.initState(tableId)),
      map(state => state.rootCategories.find(category => category.name == categoryName).id)
    );
  }
}
