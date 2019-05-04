import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import ProductItem from '../domain/ProductItem';
import Product from '../domain/Product';
import { CartService } from './cart.service';
import { I18nService } from './i18n.service';


describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CartService] });
  });

  it('should increase count as new items are added', () => {
    const service: CartService = TestBed.get(CartService);
    const count$ = service.count();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem1 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "HUF": 1500, "EUR": 5 } });

    service.add(product1, productItem1);
    count$.pipe(first()).subscribe(count => expect(count).toBe(1));

    service.add(product1, productItem1);
    count$.pipe(first()).subscribe(count => expect(count).toBe(2));
  });

  it('should sum per preferred currency', () => {
    const service: CartService = TestBed.get(CartService);
    const i18nService = TestBed.get(I18nService);
    const prices$ = service.prices();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem11 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "HUF": 1500, "EUR": 5 } });
    const productItem12 = ProductItem.fromJson({ portion: "portion2", name: { en: "Portion2" }, price: { "HUF": 3000, "EUR": 10 } });

    service.add(product1, productItem11);
    service.add(product1, productItem12);

    i18nService.setLanguage("en");

    i18nService.setCurrency("EUR");
    prices$.pipe(first()).subscribe(prices => expect(prices.size).toBe(1));
    prices$.pipe(first()).subscribe(prices => expect(prices.get("EUR")).toBe(15));

    i18nService.setCurrency("HUF");
    prices$.pipe(first()).subscribe(prices => expect(prices.size).toBe(1));
    prices$.pipe(first()).subscribe(prices => expect(prices.get("HUF")).toBe(4500));
  });

  it('should include multiple currencies when the preferred one is not available for an item', () => {
    const service: CartService = TestBed.get(CartService);
    const i18nService = TestBed.get(I18nService);
    const prices$ = service.prices();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem11 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "EUR": 5 } });
    const productItem12 = ProductItem.fromJson({ portion: "portion2", name: { en: "Portion2" }, price: { "HUF": 3000 } });

    service.add(product1, productItem11);
    service.add(product1, productItem12);

    i18nService.setLanguage("en");

    i18nService.setCurrency("EUR"); // irrelevant in this case
    prices$.pipe(first()).subscribe(prices => expect(prices.size).toBe(2));
    prices$.pipe(first()).subscribe(prices => expect(prices.get("EUR")).toBe(5));
    prices$.pipe(first()).subscribe(prices => expect(prices.get("HUF")).toBe(3000));
  });

});
