import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RouteParamsService } from './route-params.service';



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
        RouteParamsService,
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockRoute },
      ]
    });
  });

  it('should return tableId when available', () => {
    const service = TestBed.get(RouteParamsService);
    const router = TestBed.get(Router);
    const route = TestBed.get(ActivatedRoute);

    router.events.next(new NavigationEnd(1, "url", "url"));
    service.tableId().subscribe(tableId => expect(tableId).toBeNull);

    route.firstChild.params.next({ tableId: "tableId" });
    service.tableId().subscribe(tableId => expect(tableId).toBe("tableId"));
  });
});