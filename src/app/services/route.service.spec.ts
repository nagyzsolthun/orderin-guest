import { TestBed, inject } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { RouteService } from './route.service';


class MockRouter {
  events = new BehaviorSubject<NavigationEnd>(null);
}

class MockRoute {
  firstChild = {
    params: new BehaviorSubject<any>(null)
  }
}

describe('RouteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouteService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
      ]
    });
  });

  it('should return tableId when available', inject([RouteService, Router, ActivatedRoute], (
    service: RouteService,
    router: MockRouter,
    route: MockRoute) => {

    router.events.next(new NavigationEnd(1, "url", "url"));
    service.tableId().subscribe(tableId => expect(tableId).toBeNull);

    route.firstChild.params.next({ tableId: "tableId" });
    service.tableId().subscribe(tableId => expect(tableId).toBe("tableId"));

  }));
});