import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';

import { map, first, filter } from 'rxjs/operators';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';

// service to access routeParams outside of the router-outlet
@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private routeParamsObservable = new ReplaySubject<Params>(1);

  constructor(
    private router: Router,
    private route: ActivatedRoute) {

    // subscribe on routeParams
    // based on https://stackoverflow.com/questions/40219790/angular-2-get-routeparams-in-a-service
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(first())
      .subscribe(event => this.subscribeOnParams(event));
  }

  private subscribeOnParams(event) {
    this.route.firstChild.params.subscribe(params => this.routeParamsObservable.next(params));
  }

  tableId(): Observable<string> {
    return this.routeParamsObservable.pipe(map(params => params.tableId));
  }
}
