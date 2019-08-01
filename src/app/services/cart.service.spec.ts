import { TestBed } from '@angular/core/testing';
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
    const price$ = service.price();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem11 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "HUF": 1500, "EUR": 5 } });
    const productItem12 = ProductItem.fromJson({ portion: "portion2", name: { en: "Portion2" }, price: { "HUF": 3000, "EUR": 10 } });

    service.add(product1, productItem11);
    service.add(product1, productItem12);

    i18nService.setLanguage("en");

    i18nService.setCurrency("EUR");
    price$.pipe(first()).subscribe(price => expect(price.size).toBe(1));
    price$.pipe(first()).subscribe(price => expect(price.get("EUR")).toBe(15));

    i18nService.setCurrency("HUF");
    price$.pipe(first()).subscribe(price => expect(price.size).toBe(1));
    price$.pipe(first()).subscribe(price => expect(price.get("HUF")).toBe(4500));
  });

  it('should include multiple currencies when the preferred one is not available for an item', () => {
    const service: CartService = TestBed.get(CartService);
    const i18nService = TestBed.get(I18nService);
    const price$ = service.price();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem11 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "EUR": 5 } });
    const productItem12 = ProductItem.fromJson({ portion: "portion2", name: { en: "Portion2" }, price: { "HUF": 3000 } });

    service.add(product1, productItem11);
    service.add(product1, productItem12);

    i18nService.setLanguage("en");

    i18nService.setCurrency("EUR"); // irrelevant in this case
    price$.pipe(first()).subscribe(price => expect(price.size).toBe(2));
    price$.pipe(first()).subscribe(price => expect(price.get("EUR")).toBe(5));
    price$.pipe(first()).subscribe(price => expect(price.get("HUF")).toBe(3000));
  });

});
