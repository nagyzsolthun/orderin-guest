import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import Category from '../domain/Category';
import InitState from '../domain/InitState';
import Product from '../domain/Product';
import { HttpCacheService } from './http-cache.service';
import { RouteParamsService } from './route-params.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private tableIdInitState: Observable<InitState>;

  constructor(
    private http: HttpCacheService,
    private routeParamsService: RouteParamsService) {

    this.tableIdInitState = this.routeParamsService.tableId()
      .pipe(switchMap(tableId => this.initState(tableId)))
  }

  rootCategories(): Observable<Array<Category>> {
    return this.tableIdInitState.pipe(map(state => state.rootCategories));
  }

  productsOf(categoryEnglishName: string): Observable<Product[]> {
    return this.categoryIdByEnglishName(categoryEnglishName)
      .pipe(switchMap(categoryId => this.productsOfCategory(categoryId)));
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
    return this.routeParamsService.tableId().pipe(
      switchMap(tableId => this.initState(tableId)),
      map(state => state.rootCategories.find(category => I18nService.toEnglish(category.name) == categoryEnglishName).id)
    );
  }
}
