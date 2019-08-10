import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SendOrderButtonComponent } from './sendorder-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { of } from 'rxjs';

class MockCartService {
  getPrice() { return of(new Map([["EUR", 3], ["HUF", 1000]])); }
  sendOrder() { }
}

describe('CartButtonComponent', () => {
  let component: SendOrderButtonComponent;
  let fixture: ComponentFixture<SendOrderButtonComponent>;
  let compiled: HTMLElement;

  let cartService: MockCartService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendOrderButtonComponent ],
      providers: [
        { provide: CartService, useClass: MockCartService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    cartService = TestBed.get(CartService);

    fixture = TestBed.createComponent(SendOrderButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should show the price coming from cartService', () => {
    const renderedPrice = compiled.querySelector('.price').textContent;
    expect(renderedPrice).toBe("3 EUR + 1000 HUF");
  });

  it('sends order when clicked', () => {
    spyOn(cartService, "sendOrder");
    component.sendOrder();  // TODO should be through click
    fixture.detectChanges();
    expect(cartService.sendOrder).toHaveBeenCalled();
  });
});
