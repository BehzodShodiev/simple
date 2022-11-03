import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductByIdPageRoutingModule } from './product-by-id-routing.module';

import { ProductByIdPage } from './product-by-id.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductByIdPageRoutingModule
  ],
  declarations: [ProductByIdPage]
})
export class ProductByIdPageModule {}
