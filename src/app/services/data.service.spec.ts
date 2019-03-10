import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { RouteParamsService } from './route-params.service';

class MockHttpCLient {
  dataObservable = new BehaviorSubject<any>(null);
  get(url, options) {
    return this.dataObservable;
  }
}

class MockRouteParamsService {
  tableIdObservable = new BehaviorSubject<string>(null);
  tableId() {
    return this.tableIdObservable;
  }
}


describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: HttpClient, useClass: MockHttpCLient },
        { provide: RouteParamsService, useClass: MockRouteParamsService },
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  // TODO "should send request when all data available"
});
