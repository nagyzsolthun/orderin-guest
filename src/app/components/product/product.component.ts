import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchAll, switchMap, distinctUntilChanged, tap } from 'rxjs/operators';
import Product from 'src/app/domain/Product';
import { DataService } from 'src/app/services/data.service';
import { I18nService } from 'src/app/services/i18n.service';
import Item from 'src/app/domain/Item';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;

  localName$: Observable<string>;
  loading$: Observable<boolean>;
  items$: Observable<Item[]>;

  constructor(
    private i18nService: I18nService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.localName$ = this.i18nService.localText(this.product.name);
    const opened$ = this.dataService.openedProduct().pipe(map(productId => productId == this.product.id));
    this.items$ = opened$.pipe(switchMap(opened => opened ? this.dataService.itemsOf(this.product.id) : of(null)));
    this.loading$ = combineLatest(opened$, this.items$).pipe(map(values => {
      const opened = values[0];
      const items = values[1];
      return opened && !items;
    }))
  }

  @HostListener("click")
  open() {
    this.dataService.openProdut(this.product.id);
  }

}
