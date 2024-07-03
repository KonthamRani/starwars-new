import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { CharacterTableComponent } from './character-table/character-table.component';
import { CharacterDetailComponent } from './character-detail/character-detail.component';

const routes: Routes = [
  // {path:'',component:FilterPanelComponent},
  {path:'character',component:CharacterTableComponent},
  {path:'character/:id',component:CharacterDetailComponent},
  { path: '**', redirectTo: '' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
