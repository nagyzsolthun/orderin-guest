import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { first } from 'rxjs/operators';
import Category from 'src/app/domain/Category';
import { I18nService } from 'src/app/services/i18n.service';
import { RouteParamsService } from 'src/app/services/route-params.service';
import { NavbarCategoryComponent } from './navbar-category.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';


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
  localText(i18n: Map<string,string>) {
    return of(i18n.get("en"));
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
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCategoryComponent);
    component = fixture.componentInstance;
  });

  it('shows the correct name', () => {
    const routeParamsService = TestBed.get(RouteParamsService);

    routeParamsService.categoryEnglishName$.next("category1");
    component.category = Category.fromJson({id:"id1", name:{en:"category1"}});

    fixture.detectChanges();
    component.data$.pipe(first()).subscribe(data => expect(data.englishName).toBe("category1"));
  });

});
