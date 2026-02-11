import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Bestellen } from './pages/bestellen/bestellen';
import { Anlegen } from './pages/anlegen/anlegen';

export const routes: Routes = [
  { path: '', component: Bestellen },
  { path: 'anlegen', component: Anlegen },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
