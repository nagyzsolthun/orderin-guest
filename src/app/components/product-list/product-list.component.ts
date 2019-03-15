import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import Product from 'src/app/domain/Product';
import { DataService } from 'src/app/services/data.service';

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
      map(params => params.categoryEnglishName),
      switchMap(category => this.productsOf(category))
    );
  }

  private productsOf(category: string) {
    return this.dataService.productsOf(category).pipe(startWith(undefined)) // startWith undefined for the animation
  }

}
