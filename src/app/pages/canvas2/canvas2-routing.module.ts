import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Canvas2Page } from './canvas2.page';

const routes: Routes = [
  {
    path: '',
    component: Canvas2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Canvas2PageRoutingModule {}
