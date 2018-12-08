import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { filter, map, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const tableIdObservable = this.route.params
      .pipe(filter(params => params != null))
      .pipe(map(params => params.tableId));

    const dataAvailableObservable = this.dataService.rootCategories()
      .pipe(filter(rootCategories => rootCategories != null));

    combineLatest(tableIdObservable, dataAvailableObservable)
      .subscribe( values => {
        const tableId = values[0] as string;
        this.router.navigate([tableId, "products"]);
      });
  }

}
