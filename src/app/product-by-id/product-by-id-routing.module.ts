import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductByIdPage } from './product-by-id.page';

const routes: Routes = [
  {
    path: '',
    component: ProductByIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductByIdPageRoutingModule {}
