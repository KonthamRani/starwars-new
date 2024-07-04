import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { CharacterTableComponent } from './character-table/character-table.component';
import { DataService } from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { CharacterDetailComponent } from './character-detail/character-detail.component';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [AppComponent, FilterPanelComponent, CharacterTableComponent, CharacterDetailComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatButtonModule,
    FormsModule,
    AppRoutingModule,
    MatCardModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
