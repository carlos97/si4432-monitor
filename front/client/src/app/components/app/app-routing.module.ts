import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraficasComponent } from '../graficas/graficas.component';


const routes: Routes = [
  {
    path: '', component: GraficasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
