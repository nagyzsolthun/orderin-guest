import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarQueryComponent } from './navbar-query/navbar-query.component';
import { NavbarCategoryComponent } from './navbar-category/navbar-category.component';
import { SearchService } from './services/search.service';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product-list/product-list.component';
import { LoadingComponent } from './loading/loading.component';

// TODO uuid matching https://gist.github.com/anein/fba647b4206695d109c30e1fc0d2e8ee

const routes: Routes = [
  { path: ':tableId/products', component: ProductListComponent },
  { path: ':tableId', component: LoadingComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    NavbarQueryComponent,
    NavbarCategoryComponent,
    ProductListComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [ SearchService, DataService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
