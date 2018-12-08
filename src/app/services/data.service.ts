import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RouteService } from './route.service';
import { HttpCacheService } from './http-cache.service';
import InitState from '../domain/InitState';
import Category from '../domain/Category';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private initState = new BehaviorSubject<Object>(null);

  constructor(
    private http: HttpCacheService,
    private routeService: RouteService) {

    this.routeService.tableId()
      .pipe(filter(tableId => tableId != null))
      .pipe(first())
      .subscribe(tableId => this.requestInitState(tableId))
  }

  rootCategories(): Observable<Array<Category>> {
    return this.initState
      .pipe(filter(state => state != null))
      .pipe(map(InitState.fromJson))
      .pipe(map(state => state.rootCategories));
  }

  private requestInitState(tableId: string) {
    console.log(`subscribing on tableId:${tableId}`);

    const url = `${environment.apiUrl}/guest/${tableId}/initState`;
    const httpObservable = this.http.get(url);

    httpObservable.subscribe(data => this.onData(data));
  }

  private onData(data) {
    this.initState.next(data);
  }

  private rootCategoryNames(data) {
    if (data == null) {
      return [];
    }

    return data.rootCategories
      .map(id => this.findCategory(data, id))
      .filter(category => category != null)
      .map(category => category.name);
  }

  private findCategory(data, id) {
    return data.categories.find(category => category.id == id);
  }
}
