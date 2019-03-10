import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarCategoryComponent } from './navbar-category/navbar-category.component';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product-list/product-list.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProductComponent } from './product/product.component';
import { LoadingComponent } from './loading/loading.component';

// TODO uuid matching https://gist.github.com/anein/fba647b4206695d109c30e1fc0d2e8ee

const routes: Routes = [
  { path: ':tableId/products/:category', component: ProductListComponent },
  { path: ':tableId', component: WelcomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    NavbarCategoryComponent,
    ProductListComponent,
    WelcomeComponent,
    ProductComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [ DataService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
