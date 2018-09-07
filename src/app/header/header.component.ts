import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  initQuery: string = "";

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    // TODO check if query is set
  }

  search(query: string) {
    this.searchService.update(query);
  }

}
