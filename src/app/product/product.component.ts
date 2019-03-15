import { Component, OnInit, Input } from '@angular/core';
import Product from '../domain/Product';
import { I18nService } from '../services/i18n.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @Input() product: Product;

  localName$: Observable<string>;

  constructor(private i18nService: I18nService) { }

  ngOnInit() {
    this.localName$ = this.i18nService.toLocal(this.product.name);
  }

}
