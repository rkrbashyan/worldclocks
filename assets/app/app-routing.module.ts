import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClocksComponent } from "./clocks/clocks.component";
import { ClockCreateComponent } from "./clocks/clock-create.component";
import { ErrorComponent } from "./errors/error.component";



const routes: Routes = [
  { path: 'clocks', component: ClocksComponent},
  { path: '', redirectTo: '/clocks?sort=timezone', pathMatch: 'full'},
  { path: 'create-clock', component: ClockCreateComponent, outlet: 'popup' },
  { path: 'update/:id', component: ClockCreateComponent, outlet: 'popup' },
  { path: 'error', component: ErrorComponent, outlet: 'errorHandler'},
  { path: '**', redirectTo: '/clocks?sort=timezone'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }

