import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterTableComponent } from './character-table/character-table.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';

const routes: Routes = [
  {path:'',component:CharacterTableComponent},
  {path:'character/:id',component:CharacterDetailComponent},
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
