import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { first } from 'rxjs/operators';
import Category from 'src/app/domain/Category';
import { I18nService } from 'src/app/services/i18n.service';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { NavbarCategoryComponent } from './navbar-category.component';


class MockRouteParamsService {
  tableId$ = new BehaviorSubject<string>(null);
  categoryEnglishName$ = new BehaviorSubject<string>(null);
  tableId = () => this.tableId$;
  categoryEnglishName = () => this.categoryEnglishName$;
}

class MockRouter {
  navigate(commands: string[]): Promise<boolean> {
    return Promise.resolve(true);
  }
}

class MockI18nService {
  toLocal(values: Map<string,string>) {
    return of(values.get("en"));
  }
}

describe('NavbarCategoryComponent', () => {
  let component: NavbarCategoryComponent;
  let fixture: ComponentFixture<NavbarCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCategoryComponent ],
      providers: [
        { provide: RouteParamsService, useClass: MockRouteParamsService },
        { provide: Router, useClass: MockRouter },
        { provide: I18nService, useClass: MockI18nService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCategoryComponent);
    component = fixture.componentInstance;
  });

  it('should be selected if route param matches', () => {
    const routeParamsService = TestBed.get(RouteParamsService);

    routeParamsService.categoryEnglishName$.next("category1");
    component.category = Category.fromJson({id:"id1", name:{en:"category1"}});

    fixture.detectChanges();
    component.localName$.pipe(first()).subscribe(name => expect(name).toBe("category1"));
    expect(component.selected).toBe(true);
  });

  it('should not be selected if route param does not match', () => {
    const routeParamsService = TestBed.get(RouteParamsService);

    routeParamsService.categoryEnglishName$.next("category2");
    component.category = Category.fromJson({id:"id1", name:{en:"category1"}});

    fixture.detectChanges();
    component.localName$.pipe(first()).subscribe(name => expect(name).toBe("category1"));
    expect(component.selected).toBe(false);
  });

  it('should navigate when selected', () => {
    const routeParamsService = TestBed.get(RouteParamsService);
    const router = TestBed.get(Router);

    const navigateSpy = spyOn(router, "navigate");

    routeParamsService.tableId$.next("tableId");
    routeParamsService.categoryEnglishName$.next("category2");
    component.category = Category.fromJson({id:"id1", name:{en:"category1"}});
    fixture.detectChanges();

    component.select();
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith( ["tableId", "products", "category1"] );
  });

});
