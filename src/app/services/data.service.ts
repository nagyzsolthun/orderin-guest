import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataObservable: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private dataAvailableObservable: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) {

    // subscribe on tableId routeParam
    // based on https://stackoverflow.com/questions/40219790/angular-2-get-routeparams-in-a-service
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(first())
      .subscribe(event => this.subscribeOnParams(event));
  }

  dataAvailable(): Observable<boolean> {
    return this.dataAvailableObservable;
  }

  rootCategories() {
    return this.dataObservable.pipe(map(data => this.rootCategoryNames(data)));
  }

  private subscribeOnParams(event) {
    this.route.firstChild.params
      .pipe(filter(params => params.tableId)) // TODO error if tableId missing?
      .pipe(first())
      .subscribe(params => this.sendRequest(params.tableId));

  }

  private sendRequest(tableId: string) {
    console.log(`subscribing on tableId:${tableId}`);

    const url = `${environment.apiUrl}/guest/${tableId}/state`;
    const options = { withCredentials: true };
    const httpObservable = this.http.get(url, options).pipe(first());

    httpObservable.subscribe(data => this.onData(data));
  }

  private onData(data) {
    this.dataObservable.next(data);
    this.dataAvailableObservable.next(true)
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
