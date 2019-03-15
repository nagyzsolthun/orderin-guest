import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';
import Product from 'src/app/domain/Product';
import { ProductListComponent } from './product-list.component';
import { DataService } from 'src/app/services/data.service';


class MockDataService {
  productsOf$ = new ReplaySubject<Product[]>(1);
  productsOf(categoryEnglishName: string) {
    return this.productsOf$;
  }
}

class MockRoute {
  params = new BehaviorSubject<any>(null);
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let products$: Observable<Product[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListComponent ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: ActivatedRoute, useClass: MockRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;

    const route = TestBed.get(ActivatedRoute);
    route.params.next({categoryEnglishName:"category1"});
    fixture.detectChanges();

    products$ = component.products$.pipe(shareReplay(1));
    tick(50); // new subscription, wait for it to emit initial undefined value
  }));

  it('should be loading until products are available', () => {
    products$.pipe(first()).subscribe(componentProducts => expect(componentProducts).toBeUndefined());
  });

  it('should not be loading once products are available', () => {
    const dataService = TestBed.get(DataService);

    const product1 = Product.fromJson({id:"id1", name:{en:"Product1"}});
    const product2 = Product.fromJson({id:"id2", name:{en:"Product2"}});
    const products = [product1,product2];
    dataService.productsOf$.next(products);

    fixture.detectChanges();
    products$.pipe(first()).subscribe(componentProducts => expect(componentProducts).toBe(products));
  });

});
