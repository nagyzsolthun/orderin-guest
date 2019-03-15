import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { ProductComponent } from './product.component';
import { I18nService } from '../services/i18n.service';
import Product from '../domain/Product';
import { first } from 'rxjs/operators';


class MockI18nService {
  toLocal(values: Map<string,string>) {
    return of("LocalI18n")
  }
}

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      providers: [
        { provide: I18nService, useClass: MockI18nService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    component.product = Product.fromJson({id:"id1", name: {en:"English", hu:"Magyar"}});
    fixture.detectChanges();
  });

  it('should show name from i18nService', () => {
    const i18nService = TestBed.get(I18nService);
    component.localName$.pipe(first()).subscribe(name => expect(name).toBe("LocalI18n"))
  });
});
