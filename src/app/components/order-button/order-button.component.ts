import { Component, Input, HostListener, OnInit } from '@angular/core';
import Order from 'src/app/domain/Order';
import { Observable } from 'rxjs';
import { RouteParamsService } from 'src/app/services/route-params.service';

@Component({
  selector: 'app-order-button',
  templateUrl: './order-button.component.html',
  styleUrls: ['./order-button.component.css']
})
export class OrderButtonComponent implements OnInit {

  @Input() order: Order;
  tableId$: Observable<string>;

  constructor(private routeParamsService: RouteParamsService) { }

  ngOnInit() {
    this.tableId$ = this.routeParamsService.tableId();
  }

}
