import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import ProductItem from '../domain/ProductItem';
import Product from '../domain/Product';
import { CartService } from './cart.service';
import { I18nService } from './i18n.service';
import { of } from 'rxjs';
import Venue from '../domain/Venue';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { RouteParamsService } from './route-params.service';

class MockRouteParamsService {
  tableid() {
    return of("tableId");
  }
}

class MockDataService {
  venue() {
    return of(Venue.fromJson({ id: "venueId", name: "venueName" }));
  }
}

class MockHttpClient {
  put() { return of(1); }
  get() { return of([]) }
}

describe('CartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: RouteParamsService, useClass: MockRouteParamsService },
        { provide: DataService, useClass: MockDataService },
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    });
  });

  it('should increase count as new items are added', () => {
    const service = TestBed.get(CartService) as CartService;
    const count$ = service.getCount();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem1 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "HUF": 1500, "EUR": 5 } });

    service.addItem(product1, productItem1);
    count$.pipe(first()).subscribe(count => expect(count).toBe(1));

    service.addItem(product1, productItem1);
    count$.pipe(first()).subscribe(count => expect(count).toBe(2));
  });

  it('should send addToCart request when new item is added', () => {
    const service = TestBed.get(CartService) as CartService;
    const httpClient = TestBed.get(HttpClient) as HttpClient;
    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem1 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "HUF": 1500, "EUR": 5 } });

    spyOn(httpClient, "put");
    service.addItem(product1, productItem1);
    expect(httpClient.put).toHaveBeenCalled();
  });

  it('should sum per preferred currency', () => {
    const service = TestBed.get(CartService) as CartService;
    const i18nService = TestBed.get(I18nService)as I18nService;
    const price$ = service.getPrice();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem11 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "HUF": 1500, "EUR": 5 } });
    const productItem12 = ProductItem.fromJson({ portion: "portion2", name: { en: "Portion2" }, price: { "HUF": 3000, "EUR": 10 } });

    service.addItem(product1, productItem11);
    service.addItem(product1, productItem12);

    i18nService.setLanguage("en");

    i18nService.setCurrency("EUR");
    price$.pipe(first()).subscribe(price => expect(price.size).toBe(1));
    price$.pipe(first()).subscribe(price => expect(price.get("EUR")).toBe(15));

    i18nService.setCurrency("HUF");
    price$.pipe(first()).subscribe(price => expect(price.size).toBe(1));
    price$.pipe(first()).subscribe(price => expect(price.get("HUF")).toBe(4500));
  });

  it('should include multiple currencies when the preferred one is not available for an item', () => {
    const service = TestBed.get(CartService) as CartService;
    const i18nService = TestBed.get(I18nService) as I18nService;
    const price$ = service.getPrice();

    const product1 = Product.fromJson({ id: "product1", name: { en: "Product1" } });
    const productItem11 = ProductItem.fromJson({ portion: "portion1", name: { en: "Portion1" }, price: { "EUR": 5 } });
    const productItem12 = ProductItem.fromJson({ portion: "portion2", name: { en: "Portion2" }, price: { "HUF": 3000 } });

    service.addItem(product1, productItem11);
    service.addItem(product1, productItem12);

    i18nService.setLanguage("en");

    i18nService.setCurrency("EUR"); // irrelevant in this case
    price$.pipe(first()).subscribe(price => expect(price.size).toBe(2));
    price$.pipe(first()).subscribe(price => expect(price.get("EUR")).toBe(5));
    price$.pipe(first()).subscribe(price => expect(price.get("HUF")).toBe(3000));
  });

});
