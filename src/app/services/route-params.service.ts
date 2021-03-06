import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';

import { map, filter, switchMap, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';

// service to access routeParams outside of the router-outlet
@Injectable({
  providedIn: 'root'
})
export class RouteParamsService {
  private params$: Observable<ParamMap>;

  constructor(router: Router, route: ActivatedRoute) {
    // subscribe on routeParams
    // based on https://github.com/angular/angular/issues/11023
    this.params$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(() => route.firstChild.paramMap),
      shareReplay(1)
    );
  }

  tableId(): Observable<string> {
    return this.params$.pipe(
      map(params => params.get("tableId")),
      distinctUntilChanged()
    );
  }

  categoryEnglishName(): Observable<string> {
    return this.params$.pipe(
      map(params => params.get("categoryEnglishName")),
      distinctUntilChanged()
    );
  }
}
