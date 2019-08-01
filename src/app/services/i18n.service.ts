import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private language$: BehaviorSubject<string>;
  private currency$: BehaviorSubject<string>;

  constructor() {
    const navigatorLanguage = navigator.language.split("-")[0];
    const currency = navigatorLanguage == "hu" ? "HUF" : "EUR"; // TODO

    this.language$ = new BehaviorSubject<string>(navigatorLanguage);
    this.currency$ = new BehaviorSubject<string>(currency);
  }

  setLanguage(language: string) {
    this.language$.next(language);
  }

  setCurrency(currency: string) {
    this.currency$.next(currency);
  }

  localText(i18n: Map<string,string>): Observable<string> {
    return this.language$.pipe(map(lan => I18nService.toLanguage(i18n,lan)));
  }

  localCurrency(price: Map<string,number>): Observable<string> {
    return this.currency$.pipe(map(currency => I18nService.selectCurrency(price,currency)));
  }

  localAmount(price: Map<string,number>): Observable<number> {
    return this.localCurrency(price).pipe(map(currency => price.get(currency)));
  }

  static toEnglish(i18n: Map<string,string>): string {
    return I18nService.toLanguage(i18n,"en");
  }

  private static toLanguage(i18n: Map<string,string>, lan: string) {
    const first = i18n.keys[0];
    return [lan,"en","hu",first]
      .map(lan => i18n.get(lan))
      .find(value => value !== undefined)
  }

  private static selectCurrency(price: Map<string,number>, currency: string) {
    const first = price.keys[0];
    return [currency,"HUF","EUR","USD", first]
      .find(currency => price.has(currency));

  }

}
