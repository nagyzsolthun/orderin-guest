import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  private language$: BehaviorSubject<string>;

  constructor() {
    const navigatorLanguage = navigator.language.split("-")[0];
    this.language$ = new BehaviorSubject<string>(navigatorLanguage);
  }

  update(language: string) {
    this.language$.next(language);
  }

  toLocal(i18n: Map<string,string>): Observable<string> {
    return this.language$.pipe(map(lan => I18nService.toLanguage(i18n,lan)));
  }

  static toEnglish(i18n: Map<string,string>): string {
    return I18nService.toLanguage(i18n,"en");
  }

  private static toLanguage(i18n: Map<string,string>, lan: string) {
    const direct = i18n.get(lan);
    const en = i18n.get("en");
    const hu = i18n.get("hu");
    const first = i18n.get(i18n.keys[0]);
    return [direct,en,hu,first].find(value => value != undefined);
  }

}
