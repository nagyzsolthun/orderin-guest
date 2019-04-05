import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Item from 'src/app/domain/Item';
import { I18nService } from 'src/app/services/i18n.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  @Input() item: Item;

  name$: Observable<string>;
  value$: Observable<number>;
  currency$: Observable<string>

  constructor(private i18nService: I18nService) { }

  ngOnInit() {
    this.name$ = this.i18nService.localText(this.item.name);
    this.value$ = this.i18nService.localValue(this.item.price);
    this.currency$ = this.i18nService.localCurrency(this.item.price);
  }

}
