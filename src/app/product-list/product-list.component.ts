import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { map, filter, switchMap, tap, share } from 'rxjs/operators';
import Product from '../domain/Product';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products$: Observable<Array<Product>>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.products$ = this.route.params.pipe(
      map(params => params.category),
      switchMap(category => this.dataService.productsOf(category))
    );
  }

}
